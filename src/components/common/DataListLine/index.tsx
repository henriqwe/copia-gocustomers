import { ReactNode } from 'react'

type DataListLineProps = {
  title: string | ReactNode
  value: string | ReactNode
  position: number
}

function DataListLine({ title, value, position }: DataListLineProps) {
  return (
    <div
      className={`px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-6 ${
        position % 2 == 0
          ? 'dark:bg-dark-6 bg-gray-100'
          : 'dark:bg-dark-3 bg-gray-200'
      }`}
    >
      <dt className="text-sm font-medium text-gray-500">{title}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-4 dark:text-white">
        {value}
      </dd>
    </div>
  )
}

export default DataListLine
