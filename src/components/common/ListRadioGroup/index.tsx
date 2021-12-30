import { RadioGroup } from '@headlessui/react'
import React, { Dispatch, SetStateAction, useState, ReactNode } from 'react'

import * as icons from '@/common/Icons'

type ListRadioGroupProps = {
  options: { value: string; content: ReactNode }[]
  setSelectedOption: Dispatch<SetStateAction<string>>
  horizontal?: boolean
  selectedValue?: { value: string; content: ReactNode }
}

function ListRadioGroup({
  options,
  setSelectedOption,
  horizontal = false,
  selectedValue
}: ListRadioGroupProps) {
  const [selected, setSelected] = useState<{
    value: string
    content: ReactNode
  }>(
    selectedValue
      ? selectedValue
      : ({} as { value: string; content: ReactNode })
  )

  return (
    <div className="w-full">
      <div className="w-full max-w-md mx-auto">
        <RadioGroup
          value={selected}
          onChange={(e) => {
            setSelected(e)
            setSelectedOption(e?.value)
          }}
        >
          <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
          <div
            className={
              horizontal
                ? 'flex gap-4 items-start justify-start my-2'
                : 'space-y-2'
            }
          >
            {options.map((opcao, indice) => (
              <RadioGroup.Option
                key={`radio-grupo-item-${indice}`}
                value={opcao}
                className={({ active }) =>
                  `${
                    active
                      ? 'ring ring-offset ring-offset-sky-300 ring-theme-9 ring-opacity-40'
                      : ''
                  }
                ${
                  opcao.value === selected?.value
                    ? 'bg-theme-9 bg-opacity-50 text-gray-800 dark:text-gray-300'
                    : 'bg-white bg-opacity-30'
                }
                ${horizontal ? 'flex-1 mt-0' : ''}
                  relative rounded-lg shadow-md px-5 py-4 cursor-pointer flex focus:outline-none`
                }
              >
                <div className="flex items-center justify-between w-full">
                  {opcao.content}
                  {opcao.value === selected?.value && (
                    <div className="flex-shrink-0 text-white">
                      <icons.CheckIcon className="w-6 h-6" />
                    </div>
                  )}
                </div>
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}

export default ListRadioGroup
