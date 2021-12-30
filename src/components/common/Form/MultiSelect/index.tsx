import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { DeepMap, FieldError, FieldValues } from 'react-hook-form'
import * as icons from '@/common/Icons'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'

type MultiSelectProps = {
  noSearch?: boolean
  itens: Itens[]
  onChange: (
    e: {
      key: any
      title: string | number
      length?: number
      type?: string
    }[]
  ) => void
  value: {
    key: string | number
    title: string | number
  }[]
  label?: string | number
  optionClassName?: string
  className?: string
  disabled?: boolean
  edit?: boolean
  error?: DeepMap<FieldValues, FieldError>
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

type Itens = {
  key: string | number | any
  title: string | number
  length?: number
  type?: string
}

export default function MultiSelect({
  noSearch = false,
  itens,
  onChange,
  value = [],
  optionClassName = '',
  className,
  disabled = false,
  error,
  label,
  edit = false,
  icon,
  iconPosition = 'left'
}: MultiSelectProps) {
  const [selectedItens, setSelectedItens] = useState([] as Itens[])
  const [optionWidth, setOptionWidth] = useState(0)
  const [itensFiltred, setItensFiltred] = useState<(Itens | undefined)[]>([
    ...itens
  ])
  const selectRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    setOptionWidth(selectRef.current ? selectRef.current.offsetWidth : 0)
  }, [])

  function isSelected(value: Itens | undefined) {
    return selectedItens.find((el) => el.key === value?.key) ? true : false
  }

  function handleSelection(person: Itens) {
    const selectedResult = selectedItens.filter(
      (selected) => selected === person
    )

    if (selectedResult.length) {
      removePerson(person)
    } else {
      setSelectedItens((currents) => [...currents, person])
    }
  }

  function removePerson(person: Itens) {
    const removedSelection = selectedItens.filter(
      (selected) => selected !== person
    )
    setSelectedItens(removedSelection)
  }

  function disableSelectItem(item: Itens | undefined) {
    const selectItens = selectedItens.map((item) => item.key)

    if (selectItens.includes(item?.key)) {
      return true
    }

    return false
  }

  useEffect(() => {
    onChange(selectedItens)
  }, [selectedItens])

  useEffect(() => {
    if (edit && selectedItens.length === 0) {
      setSelectedItens(value)
    }
  }, [value])

  function filterInput(inputValue: string) {
    const newArrayItens: (Itens | undefined)[] = itens
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
      })
    setItensFiltred(newArrayItens)
  }
  function resetFilterInput() {
    setItensFiltred([...itens])
  }
  return (
    <>
      <div className="flex items-center justify-center">
        <div className="w-full mx-auto">
          <Listbox
            as="div"
            className="space-y-1"
            value={value}
            onChange={handleSelection}
          >
            {({ open }) => (
              <>
                {/* <Listbox.Label className="block text-sm font-medium leading-5 text-gray-700">
                Assigned to
              </Listbox.Label> */}
                <div className="relative">
                  <span className="inline-block w-full rounded-md shadow-sm">
                    <div onClick={resetFilterInput}>
                      <Listbox.Button
                        className={`${
                          disabled
                            ? 'bg-gray-500 dark:bg-gray-800 cursor-not-allowed border-gray-500'
                            : 'bg-gray-200 dark:bg-gray-700 border-gray-400'
                        } dark:bg-dark-secondary rounded-md focus:outline-none focus:border-b-blue-500 focus:shadow-sm px-3 w-full h-10 flex justify-between items-center relative ${className}`}
                        ref={selectRef}
                        disabled={disabled}
                      >
                        {icon && iconPosition === 'left' && (
                          <p className="absolute ">{icon}</p>
                        )}
                        <span
                          className={`absolute text-gray-600 dark:text-gray-500 transition-all ${
                            selectedItens.length > 0
                              ? 'text-xs top-0.5 left-3'
                              : 'text-sm text-gray-700 dark:text-gray-500 top-2.5'
                          } ${icon && iconPosition === 'left' ? 'ml-7' : ''}`}
                        >
                          {label}
                        </span>

                        <div
                          className={` ${
                            icon && iconPosition === 'left' ? 'ml-7' : ''
                          }`}
                        >
                          {selectedItens.map((person) => (
                            <div
                              key={person.key}
                              className={`inline-flex items-center px-1 mt-4 mr-1 text-white bg-gray-400 rounded ${
                                disabled ? 'dark:bg-dark-5' : 'dark:bg-dark-3'
                              }`}
                            >
                              <p className="text-tiny">{person.title}</p>
                              {!disabled && (
                                <div
                                  className="ml-1 bg-gray-100 rounded-full cursor-pointer"
                                  onClick={() => removePerson(person)}
                                >
                                  <icons.RemoveSelectItemIcon />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        {!disabled && (
                          <span
                            className={`absolute inset-y-0 right-3 flex items-center pr-2 pointer-events-none ${
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
                  </span>

                  {!disabled && (
                    <Transition
                      show={open}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                      className="absolute w-full mt-1 bg-white rounded-md shadow-lg"
                    >
                      <Listbox.Options
                        static
                        className={`absolute pb-3 mt-1  overflow-auto text-base bg-white dark:bg-dark-5 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50 ${optionClassName}`}
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
                          itensFiltred?.map((item) => {
                            const selected = isSelected(item)
                            return (
                              <Listbox.Option
                                key={item?.key}
                                value={item}
                                disabled={disableSelectItem(item)}
                                className={
                                  disableSelectItem(item)
                                    ? 'cursor-not-allowed bg-dark-2'
                                    : 'cursor-pointer'
                                }
                              >
                                {({ active }) => (
                                  <div
                                    className={`${
                                      active
                                        ? 'text-amber-900 dark:text-primary-2 bg-gray-200'
                                        : 'text-gray-900'
                                    } select-none relative py-2 pl-8 pr-4 dark:text-white`}
                                  >
                                    <span
                                      className={`${
                                        selected
                                          ? 'font-semibold'
                                          : 'font-normal'
                                      } block truncate`}
                                    >
                                      {item?.title}
                                    </span>
                                    {selected && (
                                      <span
                                        className={`absolute inset-y-0 left-0 flex items-center pl-1.5`}
                                      >
                                        <CheckIcon
                                          className="w-5 h-5 text-primary-4"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    )}
                                  </div>
                                )}
                              </Listbox.Option>
                            )
                          })
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
              </>
            )}
          </Listbox>
        </div>
      </div>
      {error && (
        <p className="block mt-1 text-xs text-theme-6">{error.message}</p>
      )}
    </>
  )
}
