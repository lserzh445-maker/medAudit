import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { BLOCK } from '../config/block.js'
import { emptySession, inheritSession } from '../lib/session.js'

const useAuditStore = create(
  persist(
    (set, get) => ({
      loggedIn: false,

      sessions: { primary: null, repeat: null },
      current: 'primary',        // какую сессию показывают экраны
      reauditUnlocked: false,    // разблокировка «Начать повторный аудит»
      decision: null,
      monitoring: null,   // { deputy, assignedAt } | null

      login: () => set({ loggedIn: true }),
      logout: () => set({ loggedIn: false }),

      // ── СЕЛЕКТОРЫ (экраны читают данные текущей сессии через них) ──
      getSession: () => get().sessions[get().current] || null,
      getAnswers: () => (get().sessions[get().current]?.answers) || {},
      getIssues: () => (get().sessions[get().current]?.issues) || {},

      // ── ЖИЗНЕННЫЙ ЦИКЛ СЕССИЙ ──
      startPrimary: (operator) =>
        set((s) => ({
          sessions: { ...s.sessions, primary: emptySession(operator) },
          current: 'primary',
        })),

      startRepeat: (operator) =>
        set((s) => {
          if (!s.reauditUnlocked || !s.sessions.primary) return {}
          return {
            sessions: { ...s.sessions, repeat: inheritSession(s.sessions.primary, operator) },
            current: 'repeat',
            monitoring: null,   // мониторинг прошлого круга исчерпан
            decision: null,     // решение главврача относилось к первичному аудиту
          }
        }),

      completeSession: () =>
        set((s) => {
          const key = s.current
          const cur = s.sessions[key]
          if (!cur) return {}
          return { sessions: { ...s.sessions, [key]: { ...cur, completedAt: new Date().toISOString() } } }
        }),

      reopenSession: () =>
        set((s) => {
          const key = s.current
          const cur = s.sessions[key]
          if (!cur) return {}
          return { sessions: { ...s.sessions, [key]: { ...cur, completedAt: null } } }
        }),

      unlockReaudit: () => set({ reauditUnlocked: true }),

      // ── ОТВЕТЫ И ФАКТЫ (пишут в текущую сессию) ──
      setAnswer: (qId, value) =>
        set((s) => {
          const key = s.current
          const cur = s.sessions[key]
          if (!cur) return {}
          const answers = { ...cur.answers, [qId]: value }
          let issues = cur.issues

          if (value === 'no') {
            const iss = issues[qId]
            if (!iss) {
              issues = {
                ...issues,
                [qId]: {
                  questionId: qId, blockId: BLOCK.id, status: 'выявлен',
                  createdAt: new Date().toISOString(), closedAt: null,
                  dueDate: null, assignee: null,
                },
              }
            } else if (iss.status === 'закрыт') {
              issues = { ...issues, [qId]: { ...iss, status: 'выявлен', closedAt: null } }
            }
          } else if (value === 'yes') {
            const iss = issues[qId]
            if (iss && iss.status !== 'закрыт') {
              issues = { ...issues, [qId]: { ...iss, status: 'закрыт', closedAt: new Date().toISOString() } }
            }
          }
          return { sessions: { ...s.sessions, [key]: { ...cur, answers, issues } } }
        }),

      setIssueStatus: (qId, status) =>
        set((s) => {
          const key = s.current
          const cur = s.sessions[key]
          if (!cur || !cur.issues[qId]) return {}
          const iss = cur.issues[qId]
          const closedAt = status === 'закрыт' ? (iss.closedAt ?? new Date().toISOString()) : null
          return { sessions: { ...s.sessions, [key]: { ...cur, issues: { ...cur.issues, [qId]: { ...iss, status, closedAt } } } } }
        }),

      setIssueDue: (qId, dueDate) =>
        set((s) => {
          const key = s.current
          const cur = s.sessions[key]
          if (!cur || !cur.issues[qId]) return {}
          const iss = cur.issues[qId]
          return { sessions: { ...s.sessions, [key]: { ...cur, issues: { ...cur.issues, [qId]: { ...iss, dueDate: dueDate || null } } } } }
        }),

      setIssueAssignee: (qId, assignee) =>
        set((s) => {
          const key = s.current
          const cur = s.sessions[key]
          if (!cur || !cur.issues[qId]) return {}
          const iss = cur.issues[qId]
          return { sessions: { ...s.sessions, [key]: { ...cur, issues: { ...cur.issues, [qId]: { ...iss, assignee: assignee || null } } } } }
        }),

      setDecision: (action) =>
        set(() => ({ decision: { action, decidedAt: new Date().toISOString() } })),

      assignMonitoring: (deputy) =>
        set(() => ({ monitoring: { deputy, assignedAt: new Date().toISOString() } })),

      // полный сброс демо
      resetSession: () =>
        set({ sessions: { primary: null, repeat: null }, current: 'primary', reauditUnlocked: false, decision: null, monitoring: null }),
    }),
    {
      name: `medaudit-${BLOCK.id}-v2`,
      partialize: (state) => ({
        sessions: state.sessions,
        current: state.current,
        reauditUnlocked: state.reauditUnlocked,
        decision: state.decision,
        monitoring: state.monitoring,
      }),
    }
  )
)

export default useAuditStore
