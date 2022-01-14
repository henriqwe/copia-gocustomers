import { Controller, useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'

import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as localizations from '@/domains/erp/monitoring/Localization'
import * as common from '@/common'

import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { showError } from 'utils/showError'
import { getStreetNameByLatLng } from '../../../api'
import {
  ClockIcon,
  ExclamationIcon,
  LocationMarkerIcon,
  MapIcon
} from '@heroicons/react/solid'
import Link from 'next/link'

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

type FormData = {
  Veiculos: {
    key: string
    title: string
  }
}
type vehicleToConsult = {
  key: any
  title: string | number
  length?: number | undefined
  type: string
}
export default function CreateLocalization() {
  const {
    localizationSchema,
    allUserVehicle,
    centerVehicleInMap,
    vehicleConsultData,
    setVehicleConsultData,
    setVehicleOnFocusId
  } = localizations.useLocalization()
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset
  } = useForm({
    resolver: yupResolver(localizationSchema)
  })
  const onSubmit = (formData: FormData) => {
    try {
      if (formData.Veiculos === undefined) {
        throw new Error('Selectione um veículo')
      }

      centerVehicleInMap(Number(formData.Veiculos.key))
    } catch (err: any) {
      showError(err)
    }
  }

  const [dadosEnd, setDadosEnd] = useState('')

  function showVehicleInfo(vehicle: vehicleToConsult) {
    const vehicleData = allUserVehicle?.filter((elem) => {
      if (elem.carro_id === vehicle.key) return elem
    })

    if (vehicleData) setVehicleConsultData(vehicleData[0])
  }

  async function getStreetName(vehicle: vehicle) {
    const response = await getStreetNameByLatLng(
      vehicle.latitude,
      vehicle.longitude
    )

    setDadosEnd(response.results[0].formatted_address)
  }

  useEffect(() => {
    if (vehicleConsultData) {
      getStreetName(vehicleConsultData)

      reset({
        Veiculos: {
          key: vehicleConsultData.carro_id,
          title: vehicleConsultData.placa
        }
      })
    }
  }, [vehicleConsultData])

  return (
    <>
      <div className="grid grid-flow-col w-full gap-2 mb-2">
        <Controller
          control={control}
          name="Veiculos"
          render={({ field: { onChange, value } }) => (
            <div>
              <form.Select
                itens={
                  allUserVehicle
                    ? allUserVehicle
                        .filter((item) => {
                          if (item.placa != null) return item
                        })
                        .map((item) => {
                          return {
                            key: item.carro_id,
                            title: item.placa as string
                          }
                        })
                    : []
                }
                value={value}
                onChange={(value) => {
                  onChange(value)
                  showVehicleInfo(value)
                  centerVehicleInMap(Number(value.key))
                  setDadosEnd('')
                  setVehicleOnFocusId(Number(value.key))
                }}
                error={errors.Cliente_Id}
                label="Veiculos"
              />
            </div>
          )}
        />
      </div>

      <common.Separator />
      {vehicleConsultData && (
        <div className="w-full mt-4">
          <div className="flex justify-between items-center">
            <p className="font-black text-lg">Informações sobre o veículo</p>
            <Link
              href={`/erp/monitoramento/trajetos/${vehicleConsultData.carro_id}?placa=${vehicleConsultData.placa}`}
            >
              <buttons.PrimaryButton
                title="Ver trajeto"
                className="col-span-3 justify-center flex"
              />
            </Link>
          </div>

          <p>
            <b>Última atualização:</b>{' '}
            {new Date(vehicleConsultData.date_rastreador).toLocaleDateString(
              'pt-br',
              {
                dateStyle: 'short'
              }
            )}{' '}
            {new Date(vehicleConsultData.date_rastreador).toLocaleTimeString(
              'pt-br',
              {
                timeStyle: 'medium'
              }
            )}
          </p>
          <div className="relative mt-5 report-timeline">
            <common.ListCard
              icon={<ExclamationIcon className="w-6 h-6" />}
              title={'Placa'}
              description={<p>{vehicleConsultData.placa}</p>}
            />
            <common.ListCard
              icon={<LocationMarkerIcon className="w-6 h-6" />}
              title={'Velocidade'}
              description={
                <p>{Math.floor(Number(vehicleConsultData.speed)) + ' Km/H'}</p>
              }
            />
            <common.ListCard
              icon={<ClockIcon className="w-6 h-6" />}
              title={'Ignição'}
              description={
                <div>
                  <p>{vehicleConsultData.ligado ? 'Ligado' : 'Desligado'}</p>
                </div>
              }
            />
            <common.ListCard
              icon={<MapIcon className="w-6 h-6" />}
              title={'Endereço'}
              description={
                dadosEnd ? <span>{dadosEnd}</span> : <span>Buscando...</span>
              }
            />
          </div>
        </div>
      )}
    </>
  )
}
