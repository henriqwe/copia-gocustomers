import { ReactNode } from 'react'
import SpinAnimado from '../../AnimatedSpin'

type PrimaryButtonProps = {
  disabled?: boolean
  className?: string
  title: string | ReactNode
  onClick?: () => void
  loading?: boolean
  type?: 'submit' | 'button' | 'reset' | undefined
}

const PrimaryButton = ({
  className,
  disabled = false,
  title,
  onClick,
  loading,
  type = 'submit'
}: PrimaryButtonProps) => (
  <button
    disabled={disabled}
    className={`px-3 py-2 my-2 text-white rounded-md bg-theme-1 bg-opacity-70 hover:bg-theme-1 hover:opacity-100 disabled:cursor-not-allowed disabled:bg-theme-15 transition flex items-center ${className}`}
    type={type}
    onClick={onClick}
  >
    {loading && <SpinAnimado className="w-5 h-5 mr-2" />} {title}
  </button>
)

export default PrimaryButton
