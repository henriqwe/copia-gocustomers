import { ReactNode } from 'react'

type OpenModalLinkProps = {
  onClick: () => void
  children: ReactNode
}

function OpenModalLink({ children, onClick }: OpenModalLinkProps) {
  return (
    <span
      className="pt-0 cursor-pointer form-help text-tiny text-theme-25"
      onClick={onClick}
    >
      {children}
    </span>
  )
}

export default OpenModalLink
