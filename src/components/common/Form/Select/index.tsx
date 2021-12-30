import { Fragment, useRef, useEffect, useState, ReactNode } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { DeepMap, FieldError, FieldValues } from 'react-hook-form'

type itensProps = (
  | undefined
  | {
      key: string | number | any
      title: string
      length?: number
      type?: string
    }
)[]

type SelectProps = {
  noSearch?: boolean
  itens: itensProps
  onChange: (e: {
    key: any
    title: string | number
    length?: number
    type: string
  }) => void
  value: {
    key: string | number
    title: string | number
  }
  label?: string | number
  optionClassName?: string
  className?: string
  disabled?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  error?: DeepMap<FieldValues, FieldError>
}

function Select({
  noSearch = false,
  itens,
  onChange,
  value = { key: '', title: '' },
  optionClassName = '',
  className,
  disabled = false,
  error,
  label,
  icon,
  iconPosition = 'left'
}: SelectProps) {
  const [optionWidth, setOptionWidth] = useState(0)
  const selectRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    setOptionWidth(selectRef.current ? selectRef.current.offsetWidth : 0)
  }, [])
  const [itensFiltred, setItensFiltred] = useState([...itens])
  function filterInput(inputValue: string) {
    const newArrayItens: itensProps =
      itens
        .map((item) => {
          if (
            item?.title
              .toString()
              .toUpperCase()
              .includes(inputValue.toUpperCase())
          ) {
            return item
          }
          return
        })
        .filter((item) => {
          if (item) return item
        }) || []
    setItensFiltred(newArrayItens)
  }
  function resetFilterInput() {
    setItensFiltred(itens)
  }
  return (
    <>
      <div className="bg-gray-200 border-b-2 rounded-md dark:bg-gray-700">
        <Listbox value={value} onChange={onChange}>
          <div>
            <div onClick={resetFilterInput}>
              <Listbox.Button
                className={`${
                  disabled
                    ? 'bg-gray-500 dark:bg-gray-800 cursor-not-allowed border-gray-500'
                    : 'bg-gray-200 dark:bg-gray-700 border-gray-400'
                } dark:bg-dark-secondary rounded-md focus:outline-none focus:border-b-blue-500 focus:shadow-sm px-3 w-full h-10 flex justify-between items-center relative ${className}`}
                placeholder={value.title as string}
                ref={selectRef}
                disabled={disabled}
              >
                {icon && iconPosition === 'left' && (
                  <p className="absolute ">{icon}</p>
                )}
                <span
                  className={`absolute text-gray-600 dark:text-gray-500 transition-all ${
                    value.title !== ''
                      ? 'text-xs top-1 left-3'
                      : 'text-sm text-gray-700 dark:text-gray-500 top-2.5'
                  } ${icon && iconPosition === 'left' ? 'ml-7' : ''}`}
                >
                  {label}
                </span>
                <span
                  className={`block text-gray-700 truncate dark:text-gray-100 ${
                    value.title !== '' ? 'mt-4' : ''
                  } ${icon && iconPosition === 'left' ? 'ml-7' : ''}`}
                >
                  {value.title}
                </span>
                {!disabled && (
                  <span
                    className={`flex items-center pr-2 pointer-events-none ${
                      icon && iconPosition === 'right' ? 'mr-4' : ''
                    }`}
                  >
                    <SelectorIcon
                      className="w-5 h-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                )}
                {icon && iconPosition === 'right' && (
                  <p className="absolute right-3">{icon}</p>
                )}
              </Listbox.Button>
            </div>
            <span
              className={`absolute text-gray-600 dark:text-gray-500 transition-all ${
                value.title !== ''
                  ? 'text-xs top-1 left-3'
                  : 'text-sm text-gray-700 dark:text-gray-500 top-2.5'
              } ${icon && iconPosition === 'left' ? 'ml-7' : ''}`}
            ></span>
            {!disabled && (
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options
                  className={`absolute pb-3 mt-1 overflow-auto text-base bg-white dark:bg-dark-5 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50 ${optionClassName}`}
                  style={{
                    width: optionWidth
                  }}
                >
                  <div className="m-3">
                    {!noSearch && (
                      <input
                        className={`${
                          disabled
                            ? 'bg-gray-500 dark:bg-gray-800 cursor-not-allowed border-gray-500'
                            : 'bg-gray-200 dark:bg-gray-800 border-gray-400'
                        } dark:bg-dark-secondary rounded-md focus:outline-none focus:border-b-blue-500 focus:shadow-sm px-3 h-10 w-full flex justify-between items-center relative ${className}`}
                        placeholder="Digite aqui para filtrar..."
                        onChange={(e) => filterInput(e.target.value)}
                      />
                    )}
                  </div>
                  {itensFiltred.length > 0 ? (
                    itensFiltred.map((item, personIdx: number) => (
                      <Listbox.Option
                        key={personIdx}
                        className={({ active }) =>
                          `${
                            active
                              ? 'text-amber-900 dark:text-primary-2 bg-gray-200'
                              : 'text-gray-900'
                          }
                    cursor-pointer select-none relative py-2 pl-4 pr-4 items-center dark:text-white`
                        }
                        value={item}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`${
                                selected ? 'font-medium' : 'font-normal'
                              } flex truncate`}
                            >
                              {item?.title}{' '}
                              {selected ? (
                                <span className="pl-3">
                                  <CheckIcon
                                    className="w-5 h-5 text-primary-4"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </span>
                          </>
                        )}
                      </Listbox.Option>
                    ))
                  ) : (
                    <Listbox.Option
                      key={0}
                      disabled
                      className={({ active }) =>
                        `${
                          active
                            ? 'text-amber-900 dark:text-primary-2 bg-gray-200'
                            : 'text-gray-900'
                        }
                cursor-pointer select-none relative py-2 pl-4 pr-4 items-center dark:text-white`
                      }
                      value={''}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`${
                              selected ? 'font-medium' : 'font-normal'
                            } flex truncate`}
                          >
                            {'Nem um resultado encontrado.'}{' '}
                            {selected ? (
                              <span className="pl-3">
                                <CheckIcon
                                  className="w-5 h-5 text-primary-4"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </span>
                        </>
                      )}
                    </Listbox.Option>
                  )}
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

export default Select
