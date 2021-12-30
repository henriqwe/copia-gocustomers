import { Fragment, useRef, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { SelectorIcon } from '@heroicons/react/solid'
import { DeepMap, FieldError, FieldValues } from 'react-hook-form'

type SelectProps = {
  items: {
    key: string | number | any
    titulo: string
    length?: number
    type?: string
  }[]
  onChange: (e: {
    key: string | number
    titulo: string | number
    length?: number
    type: string
  }) => void
  value: { key: string | number; titulo: string | number }
  optionClassName?: string
  className?: string
  disabled?: boolean
  error?: DeepMap<FieldValues, FieldError>
}

export default function SelectComGrupo({
  items,
  onChange,
  value = { key: '', titulo: '' },
  optionClassName = '',
  className,
  disabled = false,
  error
}: SelectProps) {
  const [optionWidth, setOptionWidth] = useState(0)
  const selectRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    setOptionWidth(selectRef.current ? selectRef.current.offsetWidth : 0)
  }, [])
  return (
    <>
      <div className="bg-gray-200 border-b-2 rounded-md dark:bg-gray-700">
        <Listbox value={value} onChange={onChange}>
          <div>
            <Listbox.Button
              className={`${
                disabled
                  ? 'bg-gray-500 dark:bg-gray-800 cursor-not-allowed border-gray-500'
                  : 'bg-gray-200 dark:bg-gray-700 border-gray-400'
              } dark:bg-dark-secondary rounded-md focus:outline-none focus:border-b-blue-500 focus:shadow-sm px-3 w-full h-10 flex justify-between items-center ${className}`}
              ref={selectRef}
              disabled={disabled}
            >
              <span className="block text-gray-700 truncate dark:text-gray-100">
                {value.titulo}
              </span>
              <span className="flex items-center pr-2 pointer-events-none">
                <SelectorIcon
                  className="w-5 h-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            {!disabled && (
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options
                  className={`absolute py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50 ${optionClassName}`}
                  style={{
                    width: optionWidth
                  }}
                >
                  {items.map((item, personIdx: number) => (
                    <Listbox.Option
                      key={personIdx}
                      className={({ active, disabled }) =>
                        `${
                          active
                            ? 'text-amber-900 dark:text-primary-2 bg-gray-200'
                            : 'text-gray-900'
                        }
                        ${disabled ? 'bg-gray-300 dark:bg-gray-600' : ''}
                        ${
                          item.type === 'titulo2'
                            ? 'bg-gray-400 dark:bg-gray-500'
                            : ''
                        }
                        ${
                          item.type === 'separador'
                            ? 'border-t border-dark-5'
                            : ''
                        }
                          cursor-pointer select-none relative py-2 pl-4 pr-4 items-center disabled:bg-primary-5`
                      }
                      value={item}
                      disabled={
                        item.type === 'titulo' || item.type === 'titulo2'
                      }
                    >
                      <span className={`font-normal block truncate `}>
                        {item.titulo}
                      </span>
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            )}
          </div>
        </Listbox>
      </div>
      {error && (
        <p className="block mt-1 text-xs text-theme-6">{error.message}</p>
      )}
    </>
  )
}
