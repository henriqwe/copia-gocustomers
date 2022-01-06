import { ReactNode, useState, useEffect } from 'react'

import * as common from '@/common'

import ChangeCompany from '@/domains/_compartilhado/ChangeCompany'
import MainNavigation from '@/domains/_compartilhado/MainNavigation'
import Logout from '@/domains/_compartilhado/Logout'

type MapTemplateProps = {
  children: ReactNode
  title?: string
  reload?: {
    action: () => void
    state: boolean
  }
  currentLocation?: { title: string; url: string }[]
}

export default function MapTemplate({
  children,
  title = 'Dashboard',
  reload = { action: () => null, state: false },
  currentLocation = []
}: MapTemplateProps) {
  const [disabled, setDisabled] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [open, setOpen] = useState(false)
  const [empresa, setEmpresa] = useState('Comigo Rastreamento')

  useEffect(() => {
    document.querySelector('body')?.classList.add('pr-0', 'pb-0')
  })

  return (
    <div className="flex">
      <MainNavigation />
      <div className="content pr-0">
        <div className="z-10 top-bar pr-4">
          <common.Breadcrumb
            title={title}
            reload={reload}
            currentLocation={currentLocation}
            setOpen={setOpen}
            setShowModal={setShowModal}
          />
        </div>
        <div className="w-full h-full">{children}</div>
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
