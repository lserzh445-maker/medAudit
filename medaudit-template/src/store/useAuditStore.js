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
        set((state) => ({ answers: { ...state.answers, [qId]: value } })),

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
