import React, { ReactNode } from 'react'

type FormLineProps = {
  children: ReactNode
  position: number
  grid?: number
}

const FormLine = ({ children, position, grid = 12 }: FormLineProps) => {
  const colunasDoGrid = [
    'sm:grid-cols-1',
    'sm:grid-cols-2',
    'sm:grid-cols-3',
    'sm:grid-cols-4',
    'sm:grid-cols-5',
    'sm:grid-cols-6',
    'sm:grid-cols-7',
    'sm:grid-cols-8',
    'sm:grid-cols-9',
    'sm:grid-cols-10',
    'sm:grid-cols-11',
    'sm:grid-cols-12'
  ]
  return (
    <div
      className={`px-6 py-5 bg-gray-50 sm:grid ${
        colunasDoGrid[grid - 1]
      } sm:gap-6 ${position % 2 !== 0 ? 'dark:bg-dark-6 bg-gray-100' : ''}`}
    >
      {children}
    </div>
  )
}

export default FormLine
