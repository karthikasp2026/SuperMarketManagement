import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('marketflow-theme') || 'dark')
  const [accent, setAccent] = useState(() => localStorage.getItem('marketflow-accent') || '#c7f36b')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.setProperty('--accent', accent)
    localStorage.setItem('marketflow-theme', theme)
    localStorage.setItem('marketflow-accent', accent)
  }, [theme, accent])

  return (
    <ThemeContext.Provider value={{ theme, accent, setTheme, setAccent }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside ThemeProvider.')
  return context
}
