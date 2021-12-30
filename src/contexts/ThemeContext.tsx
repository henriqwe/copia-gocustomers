import { useState } from 'react'
import { createContext, ReactNode, useContext } from 'react'

type ProvedorProps = {
  children: ReactNode
}

type ThemeContextProps = {
  theme: string
  changeTheme: () => void
}

export const ThemeContext = createContext<ThemeContextProps>(
  {} as ThemeContextProps
)

export const ThemeProvider = ({ children }: ProvedorProps) => {
  const [theme, setTheme] = useState('light')

  function changeTheme() {
    if (theme === 'light') {
      setTheme('dark')
      return
    }
    setTheme('light')
  }

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  return useContext(ThemeContext)
}
