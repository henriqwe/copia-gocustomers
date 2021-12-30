import { Fragment, useRef, useEffect, useState, ReactNode } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { SelectorIcon } from '@heroicons/react/solid'
import { DeepMap, FieldError, FieldValues } from 'react-hook-form'

type SelectWithGroup = {
  noSearch?: boolean
  itens: Itens[]
  onChange: (e: Itens) => void
  value: Itens
  optionClassName?: string
  className?: string
  disabled?: boolean
  disabledParents?: boolean
  error?: DeepMap<FieldValues, FieldError>
  bloqued?: string[]
  label?: string | number
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

type Itens = {
  key: string | number | any
  title: string
  length?: number
  children?: Itens[]
}

function SelectWithGroup({
  noSearch,
  itens,
  onChange,
  value = { key: '', title: '' },
  optionClassName = '',
  className,
  disabled = false,
  disabledParents = false,
  error,
  bloqued = [],
  label,
  icon,
  iconPosition = 'left'
}: SelectWithGroup) {
  const [optionWidth, setOptionWidth] = useState(0)
  const selectRef = useRef<HTMLButtonElement>(null)
  const [itensFiltred, setItensFiltred] = useState<(Itens | undefined)[]>([
    ...itens
  ])
  useEffect(() => {
    setOptionWidth(selectRef.current ? selectRef.current.offsetWidth : 0)
  }, [])

  function filterInput(inputValue: string) {
    const newArrayItens: (Itens | undefined)[] =
      itens
        .map((item) => {
          const allItens = new Set()

          if (
            item?.title
              .toString()
              .toUpperCase()
              .includes(inputValue.toUpperCase())
          ) {
            allItens.add(item.title)
          }
          item.children?.forEach((children) => {
            if (
              children?.title
                .toString()
                .toUpperCase()
                .includes(inputValue.toUpperCase())
            ) {
              allItens.add(children.title)
            }
            children.children?.forEach((grandchild) => {
              if (
                grandchild?.title
                  .toString()
                  .toUpperCase()
                  .includes(inputValue.toUpperCase())
              ) {
                allItens.add(grandchild.title)
              }
            })
          })
          if (allItens.size > 0) return item
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
            {!disabled && (
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options
                  className={`absolute pb-3 mt-1 overflow-auto text-base bg-white dark:bg-dark-7 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50 ${optionClassName}`}
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
                      <div key={'item' + personIdx}>
                        <Listbox.Option
                          className={({ active }) =>
                            `${
                              active ? 'dark:text-primary-2 bg-gray-200' : ''
                            } select-none relative py-2 pl-4 pr-4 items-center disabled:bg-primary-5 ${
                              (disabledParents && item?.children?.length) ||
                              bloqued.includes(item?.key)
                                ? 'cursor-not-allowed'
                                : 'cursor-pointer'
                            }`
                          }
                          value={item}
                          disabled={
                            ((disabledParents &&
                              item?.children?.length) as boolean) ||
                            bloqued.includes(item?.key)
                          }
                        >
                          <span className={`font-normal block truncate `}>
                            {item?.title}
                          </span>
                        </Listbox.Option>
                        {item?.children
                          ? item?.children.map((child, index) => (
                              <div key={'filho' + index}>
                                <Listbox.Option
                                  className={({ active }) =>
                                    `cursor-pointer select-none relative py-2 pl-6 pr-6 items-center disabled:bg-primary-5 dark:bg-dark-6
                                  ${
                                    (disabledParents &&
                                      child.children?.length) ||
                                    bloqued.includes(child.key)
                                      ? 'cursor-not-allowed'
                                      : 'cursor-pointer'
                                  } 
                                 ${
                                   active
                                     ? 'dark:text-primary-2 dark:bg-gray-200 bg-gray-200'
                                     : ''
                                 } `
                                  }
                                  value={child}
                                  disabled={
                                    (disabledParents &&
                                      !!child.children?.length) ||
                                    bloqued.includes(child.key)
                                  }
                                >
                                  <span
                                    className={`font-normal block truncate `}
                                  >
                                    {child.title}
                                  </span>
                                </Listbox.Option>
                                {child.children?.map((child2, index) => (
                                  <Listbox.Option
                                    key={'filho2' + index}
                                    className={({ active }) =>
                                      `${
                                        active
                                          ? 'dark:text-primary-2 dark:bg-gray-200 bg-gray-200'
                                          : ''
                                      } cursor-pointer select-none relative py-2 pl-8 pr-6 items-center disabled:bg-primary-5 dark:bg-dark-5`
                                    }
                                    value={child2}
                                    disabled={bloqued.includes(child2.key)}
                                  >
                                    <span
                                      className={`font-normal block truncate `}
                                    >
                                      {child2.title}
                                    </span>
                                  </Listbox.Option>
                                ))}
                              </div>
                            ))
                          : null}
                      </div>
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
                            {'Nem um resultado encontrado.'}
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

export default SelectWithGroup
