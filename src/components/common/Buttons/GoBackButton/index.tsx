import router from 'next/router'

type GoBackButtonProps = {
  disabled?: boolean
  className?: string
  title?: string
  onClick?: () => void
}

const GoBackButton = ({
  className,
  disabled = false,
  title = 'Voltar',
  onClick = () => router.back()
}: GoBackButtonProps) => (
  <button
    disabled={disabled}
    className={`px-3 py-2 my-2 text-white rounded-md bg-gray-500 bg-opacity-70 hover:bg-gray-500 hover:opacity-100 disabled:cursor-not-allowed disabled:bg-theme-15 transition ${className}`}
    type="button"
    onClick={onClick}
  >
    {title}
  </button>
)

export default GoBackButton
