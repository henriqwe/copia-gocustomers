import { Tab } from '@headlessui/react'

type TabsProps = {
  categories: any
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Tabs({ categories }: TabsProps) {
  return (
    <div className="w-full px-2 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex space-x-2 bg-white rounded-md dark:bg-gray-800">
          {Object.keys(categories).map((categoria) => (
            <Tab
              key={categoria}
              className={({ selected }) =>
                classNames(
                  'w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg',
                  'focus:outline-none focus:ring ring-gray-400 dark:ring-gray-500',
                  selected
                    ? 'dark:bg-gray-700 bg-gray-300'
                    : 'text-gray-600 dark:text-white font-light hover:bg-gray-300 hover:text-gray-900 dark:hover:bg-gray-700 hover:font-semibold'
                )
              }
            >
              {categoria}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {Object.values(categories).map((secao, idx) => (
            <Tab.Panel key={idx}>{secao}</Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}
