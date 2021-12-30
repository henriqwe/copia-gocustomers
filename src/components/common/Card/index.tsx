import { ReactNode } from 'react'

const Card = ({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) => (
  <main
    className={`col-span-12 py-4 bg-white rounded-md dark:bg-dark-3 ${className}`}
  >
    {children}
  </main>
)

export default Card
