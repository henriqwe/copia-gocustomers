import React, { ReactNode } from 'react'

type ListItemProps = {
  children: ReactNode
  title: string
  position: number
}

const ListItem = ({ children, title, position }: ListItemProps) => (
  <dl className={`${position % 2 !== 0 ? 'dark:bg-dark-6 bg-gray-100' : ''}`}>
    <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-8">
      <dt className="flex items-center justify-end flex-1 h-10 text-sm font-medium text-gray-500">
        {title}
      </dt>

      <dd className="flex items-center w-full h-10 mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1 ">
        {children}
      </dd>
    </div>
  </dl>
)

export default ListItem
