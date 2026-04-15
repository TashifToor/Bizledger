import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('access_token') || null,

  setUser: (user) => set({ user }),

  login: (tokens, user) => {
    localStorage.setItem('access_token', tokens.access)
    localStorage.setItem('refresh_token', tokens.refresh)
    set({ token: tokens.access, user })
  },

  logout: () => {
    localStorage.clear()
    set({ token: null, user: null })
  },
}))

export default useAuthStore