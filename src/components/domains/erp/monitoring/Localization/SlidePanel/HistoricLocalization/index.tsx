import { Controller, useForm } from 'react-hook-form'
import { useState } from 'react'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as localizations from '@/domains/erp/monitoring/Localization'
import * as common from '@/common'

import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { showError } from 'utils/showError'
import { getStreetNameByLatLng } from '../../../api'

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
  const { localizationSchema, allUserVehicle, centerVehicleInMap } =
    localizations.useLocalization()
  const {
    handleSubmit,
    formState: { errors },
    control
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

  const [vehicleConsultData, setVehicleConsultData] = useState<vehicle>()
  const [dadosEnd, setDadosEnd] = useState('')

  function showVehicleInfo(vehicle: vehicleToConsult) {
    const vehicleData = allUserVehicle?.filter((elem) => {
      if (elem.carro_id === vehicle.key) return elem
    })

    if (vehicleData) setVehicleConsultData(vehicleData[0])
  }

  async function getStreetName(vehicleConsultData: vehicle) {
    const response = await getStreetNameByLatLng(
      vehicleConsultData.latitude,
      vehicleConsultData.longitude
    )

    setDadosEnd(response.results[0].formatted_address)
  }

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
          <p className="font-black text-lg">Informações sobre o veículo</p>
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
          <p>
            <b>Placa:</b> {vehicleConsultData.placa}
          </p>
          <p>
            <b>Velocidade:</b> {Math.floor(Number(vehicleConsultData.speed))}{' '}
            km/h
          </p>
          <p>
            <b>Ignição:</b> {vehicleConsultData.ligado ? 'Ligado' : 'Desligado'}
          </p>
          <p>
            <b>Endereço:</b>{' '}
            {dadosEnd ? (
              <span>{dadosEnd}</span>
            ) : (
              <button
                className="underline"
                onClick={() => {
                  getStreetName(vehicleConsultData)
                }}
              >
                Clique aqui para consultar
              </button>
            )}
          </p>
        </div>
      )}
    </>
  )
}
