import { MoonIcon, SunIcon } from '@heroicons/react/outline'
import { useTheme } from 'contexts/ThemeContext'

export default function ChangeTheme() {
  const { changeTheme, theme } = useTheme()
  return (
    <div className="relative inline-block pl-2 align-middle transition duration-200 ease-in select-none">
      <button
        className={`flex justify-center w-8 h-8 items-center ${
          theme === 'light' ? 'bg-theme-7' : 'bg-theme-8'
        } rounded-full`}
        onClick={changeTheme}
      >
        {theme === 'light' ? (
          <SunIcon className="w-6 h-6 text-white" />
        ) : (
          <MoonIcon className="w-6 h-6 text-theme-7" />
        )}
      </button>
    </div>
  )
}
