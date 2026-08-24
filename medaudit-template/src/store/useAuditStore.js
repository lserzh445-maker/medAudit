import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { BLOCK } from '../config/block.js'

const useAuditStore = create(
  persist(
    (set) => ({
      loggedIn: false,
      answers: {},
      issues: {},
      decision: null,

      login: () => set({ loggedIn: true }),
      logout: () => set({ loggedIn: false }),

      setAnswer: (qId, value) =>
        set((s) => {
          const answers = { ...s.answers, [qId]: value }
          let issues = s.issues

          if (value === 'no') {
            const cur = issues[qId]
            if (!cur) {
              issues = {
                ...issues,
                [qId]: {
                  questionId: qId,
                  blockId: BLOCK.id,
                  status: 'выявлен',
                  createdAt: new Date().toISOString(),
                  closedAt: null,
                  dueDate: null,
                  assignee: null,
                },
              }
            } else if (cur.status === 'закрыт') {
              issues = { ...issues, [qId]: { ...cur, status: 'выявлен', closedAt: null } }
            }
          } else if (value === 'yes') {
            const cur = issues[qId]
            if (cur && cur.status !== 'закрыт') {
              issues = {
                ...issues,
                [qId]: { ...cur, status: 'закрыт', closedAt: new Date().toISOString() },
              }
            }
          }

          return { answers, issues }
        }),

      resetAnswer: (qId) =>
        set((state) => {
          const next = { ...state.answers }
          delete next[qId]
          return { answers: next }
        }),

      setIssueStatus: (qId, status) =>
        set((s) => {
          const cur = s.issues[qId]
          if (!cur) return {}
          const closedAt =
            status === 'закрыт' ? (cur.closedAt ?? new Date().toISOString()) : null
          return { issues: { ...s.issues, [qId]: { ...cur, status, closedAt } } }
        }),

      setIssueDue: (qId, dueDate) =>
        set((s) => {
          const cur = s.issues[qId]
          if (!cur) return {}
          return { issues: { ...s.issues, [qId]: { ...cur, dueDate: dueDate || null } } }
        }),

      setIssueAssignee: (qId, assignee) =>
        set((s) => {
          const cur = s.issues[qId]
          if (!cur) return {}
          return { issues: { ...s.issues, [qId]: { ...cur, assignee: assignee || null } } }
        }),

      setDecision: (action) =>
        set(() => ({ decision: { action, decidedAt: new Date().toISOString() } })),

      resetSession: () => set({ answers: {}, issues: {}, decision: null }),
    }),
    {
      name: `medaudit-${BLOCK.id}`,
      partialize: (state) => ({ answers: state.answers, issues: state.issues, decision: state.decision }),
    }
  )
)

export default useAuditStore
