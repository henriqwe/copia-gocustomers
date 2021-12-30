import { Menu, Transition } from '@headlessui/react'
import {
  LogoutIcon,
  UserIcon,
  OfficeBuildingIcon
} from '@heroicons/react/outline'
import { Dispatch, Fragment, SetStateAction } from 'react'

type UserMenuProps = {
  setOpen: Dispatch<SetStateAction<boolean>>
  setShowModal: Dispatch<SetStateAction<boolean>>
}

export default function UserMenu({ setOpen, setShowModal }: UserMenuProps) {
  return (
    <div className="pt-1 pl-4">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex items-center justify-center w-full border-b border-gray-200 lg:flex-row dark:border-dark-5">
            <div className="w-8 h-8 image-fit">
              <img
                alt="Usuário"
                className="border rounded-full border-theme-13"
                src="https://visualpharm.com/assets/30/User-595b40b85ba036ed117da56f.svg"
              />
            </div>
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
          <Menu.Items className="absolute right-0 z-50 w-56 mt-2 origin-top-right divide-y divide-gray-100 rounded-md shadow-lg bg-theme-26 dark:bg-dark-3 ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="z-50 py-3">
              <div className="ml-4">
                <h2 className="text-white text-md">Alex</h2>
                <h3 className="text-xs text-theme-28">email@example.com</h3>
              </div>
              <div className="px-2 pt-2 my-4 border-t border-theme-27 dark:border-dark-3">
                <Menu.Item>
                  <button
                    className={`group flex rounded-md items-center w-full px-2 py-2 text-sm hover:bg-theme-1 transition text-white dark:text-theme-8`}
                  >
                    <UserIcon
                      className="w-5 h-5 mr-2 dark:border-theme-8"
                      aria-hidden="true"
                    />
                    Perfil
                  </button>
                </Menu.Item>

                <Menu.Item>
                  <button
                    className={`group flex rounded-md items-center w-full px-2 py-2 text-sm hover:bg-theme-1 transition text-white dark:text-theme-8`}
                    onClick={() => setOpen(true)}
                  >
                    <OfficeBuildingIcon
                      className="w-5 h-5 mr-2 dark:text-theme-8"
                      aria-hidden="true"
                    />
                    Alterar empresa
                  </button>
                </Menu.Item>
              </div>

              <div className="px-2 pt-2 border-t border-theme-27 dark:border-dark-3">
                <Menu.Item>
                  <button
                    onClick={() => {
                      setShowModal(true)
                    }}
                    className={`group flex rounded-md items-center w-full px-2 py-2 text-sm hover:bg-theme-1 transition text-white dark:text-theme-8`}
                  >
                    <LogoutIcon
                      className="w-5 h-5 mr-2 dark:border-theme-8"
                      aria-hidden="true"
                    />
                    Sair
                  </button>
                </Menu.Item>
              </div>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
