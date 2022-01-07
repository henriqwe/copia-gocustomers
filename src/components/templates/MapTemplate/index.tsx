import { ReactNode, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import * as common from '@/common'
import * as form from '@/common/Form'
import * as localizations from '@/domains/erp/monitoring/Localization'

import ChangeCompany from '@/domains/_compartilhado/ChangeCompany'
import MainNavigation from '@/domains/_compartilhado/MainNavigation'
import Logout from '@/domains/_compartilhado/Logout'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'

type vehicleToConsult = {
  key: any
  title: string | number
  length?: number | undefined
  type: string
}

type vehicle = {
  crs: string
  data: string
  dist: string
  latitude: string
  ligado: number
  longitude: string
  speed: string
  carro_id?: number
  placa?: string
  chassis?: string
  renavan?: string
  ano_modelo?: string
  cor?: string
  veiculo?: string
  carro_fabricante?: string
  carro_categoria?: string
  carro_tipo?: string
  combustivel?: string
  ano?: string
  frota?: string
  imei?: string
  date_rastreador?: string
}
type MapTemplateProps = {
  children: ReactNode
  title?: string
  allUserVehicle?: vehicle[]
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
  allUserVehicle,
  currentLocation = []
}: MapTemplateProps) {
  const [disabled, setDisabled] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [open, setOpen] = useState(false)
  const [empresa, setEmpresa] = useState('Comigo Rastreamento')
  const { localizationSchema, centerVehicleInMap, setVehicleConsultData } =
    localizations.useLocalization()
  const {
    formState: { errors },
    control
  } = useForm({
    resolver: yupResolver(localizationSchema)
  })
  function showVehicleInfo(vehicle: vehicleToConsult) {
    const vehicleData = allUserVehicle?.filter((elem) => {
      if (elem.carro_id === vehicle.key) return elem
    })

    if (vehicleData) setVehicleConsultData(vehicleData[0])
  }

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
