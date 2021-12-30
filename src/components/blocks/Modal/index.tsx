import { Fragment, ReactNode } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import * as common from '@/common'

type ModalProps = {
  open: boolean
  handler: any
  formContent?: ReactNode
  title: string
}

export default function Modal({
  open,
  handler,
  formContent,
  title
}: ModalProps) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-hidden"
        onClose={() =>
          handler((lastState: any) => {
            return {
              ...lastState,
              open: false
            }
          })
        }
      >
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="absolute inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
          </Transition.Child>
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="relative w-screen max-w-md">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-500"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-500"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 left-0 flex pt-4 pr-2 -ml-8 sm:-ml-10 sm:pr-4">
                    <button
                      data-testid="button"
                      type="button"
                      className="text-gray-300 rounded-md hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                      onClick={() =>
                        handler((lastState: any) => {
                          return {
                            ...lastState,
                            open: false
                          }
                        })
                      }
                    >
                      <span className="sr-only">Fechar painel</span>
                      <XIcon className="w-6 h-6" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex flex-col h-full py-6 overflow-y-scroll bg-white shadow-xl dark:bg-dark-3">
                  <div className="px-4 sm:px-6">
                    <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-theme-8">
                      {title}
                    </Dialog.Title>
                  </div>
                  <common.Separator />
                  <div className="relative flex-1 px-4 mt-6 sm:px-6">
                    <div className="absolute inset-0 px-4 sm:px-6">
                      <div className="h-full" aria-hidden="true">
                        {formContent}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
