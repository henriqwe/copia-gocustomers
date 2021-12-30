import React, { Dispatch, SetStateAction, useState } from 'react'
import { RadioGroup } from '@headlessui/react'
import * as icons from '@/common/Icons'

type OptionsGroupProps = {
  setCompanies: Dispatch<SetStateAction<string>>
  companies: {
    name: string
    ram: string
    cpus: string
    disk: string
    active?: boolean
  }[]
}

export default function OptionsGroup({
  setCompanies,
  companies
}: OptionsGroupProps) {
  const [selected, setSelected] = useState(companies[0])

  return (
    <div className="w-full">
      <div className="w-full max-w-md mx-auto">
        <RadioGroup
          value={selected}
          onChange={(e) => {
            setSelected(e)
            setCompanies(e.name)
          }}
        >
          <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
          <div className="space-y-4">
            {companies.map((empresa) => (
              <RadioGroup.Option
                key={empresa.name}
                value={empresa}
                className={({ active, checked }) =>
                  `${
                    active
                      ? 'ring-2 ring-offset-2 ring-offset-sky-300 ring-white ring-opacity-60'
                      : ''
                  }
                  ${
                    checked
                      ? 'bg-theme-20 dark:bg-dark-4 text-white'
                      : 'bg-theme-21 dark:bg-dark-7 dark:bg-opacity-50'
                  }
                    relative rounded-lg shadow-md px-5 py-4 cursor-pointer flex focus:outline-none`
                }
              >
                {({ checked }) => (
                  <>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium  ${
                              checked
                                ? 'text-white'
                                : 'text-gray-900 dark:text-gray-500'
                            }`}
                          >
                            {empresa.name}
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="span"
                            className={`inline ${
                              checked
                                ? 'text-white'
                                : 'text-gray-900 dark:text-gray-500'
                            }`}
                          >
                            <span>
                              {empresa.ram}/{empresa.cpus}
                            </span>{' '}
                            <span aria-hidden="true">&middot;</span>{' '}
                            <span>{empresa.disk}</span>
                          </RadioGroup.Description>
                        </div>
                      </div>
                      {checked && (
                        <div className="flex-shrink-0 text-white">
                          <icons.CheckIcon className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}
