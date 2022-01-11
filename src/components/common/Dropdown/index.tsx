import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { ChevronDownIcon } from '@heroicons/react/solid'

export default function Dropdown({
  title,
  items,
  handler
}: {
  title: string
  items: string[]
  handler: (value: string) => void
}) {
  return (
    <div className="pt-1 pl-4">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex items-center justify-center w-full border-b border-gray-200 lg:flex-row dark:border-dark-5">
            {title}
            <ChevronDownIcon
              className="w-5 h-5 ml-2 -mr-1 text-violet-200 hover:text-violet-100"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-50 w-56 mt-2 origin-top-right divide-y divide-gray-100 rounded-md shadow-lg bg-theme-26 dark:bg-dark-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-2 my-2 border-t border-theme-27 dark:border-dark-3">
              {items.map((item, index) => {
                return (
                  <Menu.Item key={index}>
                    <button
                      onClick={(e) => handler(e.target.value)}
                      value={item}
                      className={`group flex rounded-md items-center w-full px-2 py-2 text-sm hover:bg-theme-1 transition text-white dark:text-theme-8`}
                    >
                      {item}
                    </button>
                  </Menu.Item>
                )
              })}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
