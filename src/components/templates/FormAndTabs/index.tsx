import { ReactNode, useState } from 'react'

import * as common from '@/common'

import Logout from '@/domains/_compartilhado/Logout'
import ChangeCompany from '@/domains/_compartilhado/ChangeCompany'
import MainNavigation from '@/domains/_compartilhado/MainNavigation'

type TemplateProps = {
  children: ReactNode
  Form: ReactNode
  title: string
  reload: {
    action: () => void
    state: boolean
  }
  currentLocation: { title: string; url: string }[]
}

export default function FormAndTabs({
  children,
  Form,
  title,
  reload,
  currentLocation
}: TemplateProps) {
  const [desativado, setDesativado] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [open, setOpen] = useState(false)
  const [empresa, setEmpresa] = useState('Comigo Rastreamento')
  return (
    <>
      <div className="flex items-center justify-end pr-8">
        <div className="flex justify-end w-full">
          <div className="w-8/12 h-2 rounded-t-full bg-theme-18 dark:bg-theme-15"></div>
        </div>
      </div>

      <div className="flex">
        <MainNavigation />
        <div className="content">
          <div className="z-40 top-bar">
            <common.Breadcrumb
              title={title}
              reload={reload}
              currentLocation={currentLocation}
              setOpen={setOpen}
              setShowModal={setShowModal}
            />
          </div>
          <div className="grid grid-cols-12 gap-6 lg:divide-x">
            <div className="col-span-12 mt-6 lg:col-span-7">{Form}</div>
            <div className="col-span-12 mt-6 lg:pl-6 lg:col-span-5 ">
              {children}
            </div>
          </div>
        </div>
        <ChangeCompany
          empresa={empresa}
          setEmpresa={setEmpresa}
          open={open}
          setOpen={setOpen}
        />
        <Logout
          disabled={desativado}
          open={showModal}
          setDisabled={setDesativado}
          setOpen={setShowModal}
        />
      </div>
    </>
  )
}
