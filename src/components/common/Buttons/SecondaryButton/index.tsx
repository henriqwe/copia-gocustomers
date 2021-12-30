import * as common from '@/common'
import * as icons from '@/common/Icons'
import { ReactNode } from 'react'

type SecondaryButtonProps = {
  disabled?: boolean
  handler: () => void
  loading?: boolean
  className?: string
  buttonClassName?: string
  svgClassName?: string
  divClassName?: string
  title?: string | ReactNode
  type?: 'submit' | 'button' | 'reset'
}

function SecondaryButton({
  handler,
  loading = false,
  disabled = false,
  className = 'w-5 h-5',
  buttonClassName,
  svgClassName,
  divClassName,
  title,
  type = 'submit'
}: SecondaryButtonProps) {
  return (
    <div className={`flex items-center ${divClassName}`}>
      {/* <p className="text-sm font-light">Clique para</p> */}
      <button
        disabled={disabled}
        className={`flex items-center text-white px-3 py-2 transition rounded-md bg-theme-9 bg-opacity-70 hover:bg-theme-9 hover:opacity-100 disabled:cursor-not-allowed disabled:bg-theme-15 ${buttonClassName}`}
        onClick={handler}
        type={type}
      >
        {loading ? (
          <common.AnimatedSpin className={`w-5 h-5 mr-2 ${svgClassName}`} />
        ) : title ? (
          title
        ) : (
          <icons.AddIcon className={className} />
        )}
      </button>
    </div>
  )
}
export default SecondaryButton
