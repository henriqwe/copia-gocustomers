import { ReactNode, useState } from 'react'

import * as common from '@/common'

import ChangeCompany from '@/domains/_compartilhado/ChangeCompany'
import MainNavigation from '@/domains/_compartilhado/MainNavigation'
import Logout from '@/domains/_compartilhado/Logout'

type BaseTemplateProps = {
  children: ReactNode
  title?: string
  reload?: {
    action: () => void
    state: boolean
  }
  currentLocation?: { title: string; url: string }[]
}

export default function BaseTemplate({
  children,
  title = 'Dashboard',
  reload = { action: () => null, state: false },
  currentLocation = []
}: BaseTemplateProps) {
  const [disabled, setDisabled] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [open, setOpen] = useState(false)
  const [empresa, setEmpresa] = useState('Comigo Rastreamento')
  return (
    <div className="flex">
      <MainNavigation />
      <div className="content">
        <div className="z-10 top-bar">
          <common.Breadcrumb
            title={title}
            reload={reload}
            currentLocation={currentLocation}
            setOpen={setOpen}
            setShowModal={setShowModal}
          />
        </div>
        <div className="h-5/6">{children}</div>
      </div>
      <ChangeCompany
        empresa={empresa}
        setEmpresa={setEmpresa}
        open={open}
        setOpen={setOpen}
      />
      <Logout
        disabled={disabled}
        open={showModal}
        setDisabled={setDisabled}
        setOpen={setShowModal}
      />
    </div>
  )
}
