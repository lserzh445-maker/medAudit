import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { BLOCK } from '../config/block.js'

const useAuditStore = create(
  persist(
    (set) => ({
      loggedIn: false,
      answers: {},
      issues: {},

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
    }),
    {
      name: `medaudit-${BLOCK.id}`,
      partialize: (state) => ({ answers: state.answers, issues: state.issues }),
    }
  )
)

export default useAuditStore
