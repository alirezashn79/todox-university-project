import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ITheme {
  theme: 'light' | 'dark'
  initialTheme: () => void
  toggleTheme: () => void
}

const useTheme = create<ITheme>()(
  persist(
    (set, get) => ({
      theme: 'light',
      initialTheme: () => {
        document.documentElement.setAttribute('data-theme', get().theme)
      },
      toggleTheme: () => {
        set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' }))
        document.documentElement.setAttribute('data-theme', get().theme)
      },
    }),
    {
      name: 'theme',
      version: undefined,
    }
  )
)

export default useTheme
