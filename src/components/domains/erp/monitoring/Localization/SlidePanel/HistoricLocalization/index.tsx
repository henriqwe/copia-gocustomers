import { Controller, useForm } from 'react-hook-form'
import { useState } from 'react'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as localizations from '@/domains/erp/monitoring/Localization'

import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

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
  Id: string
  Cliente_Id: {
    key: string
    title: string
  }
  Colaborador_Id: {
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
    createLocalizationLoading,
    createLocalization,
    setSlidePanelState,
    localizationsRefetch,
    localizationSchema,
    allUserVehicle
  } = localizations.useLocalization()
  const {
    handleSubmit,
    formState: { errors },
    control
  } = useForm({
    resolver: yupResolver(localizationSchema)
  })
  const onSubmit = (formData: FormData) => {
    try {
      if (
        formData.Cliente_Id === undefined &&
        formData.Colaborador_Id === undefined
      ) {
        throw new Error('Preencha um campo para continuar')
      }
      createLocalization({
        variables: {
          Cliente_Id: formData.Cliente_Id ? formData.Cliente_Id.key : null,
          Colaborador_Id: formData.Colaborador_Id
            ? formData.Colaborador_Id.key
            : null
        }
      }).then(() => {
        localizationsRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false }
        })
        notification('Usuário cadastrado com sucesso', 'success')
      })
    } catch (err: any) {
      showError(err)
    }
  }

  const [vehicleConsultData, setVehicleConsultData] = useState<vehicle>()

  function showVehicleInfo(vehicle: vehicleToConsult) {
    const vehicleData = allUserVehicle?.filter((elem) => {
      if (elem.carro_id === vehicle.key) return elem
    })

    if (vehicleData) setVehicleConsultData(vehicleData[0])
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      data-testid="inserirForm"
      className="flex flex-col items-end"
    >
      <div className="grid grid-flow-col w-full gap-2 mb-2">
        <div className="col-span-10">
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
                  }}
                  error={errors.Cliente_Id}
                  label="Veiculos"
                />
              </div>
            )}
          />
        </div>

        <buttons.SecondaryButton
          className="col-span-2"
          title="Exibir no Mapa"
          handler={() => {
            return
          }}
          disabled={createLocalizationLoading}
          loading={createLocalizationLoading}
        />
      </div>

      {vehicleConsultData && (
        <div className="w-full mt-4">
          <h2>Informações</h2>
          <p>
            <b>Última atualização:</b> {vehicleConsultData.date_rastreador}
          </p>
          <p>
            <b>Placa:</b> {vehicleConsultData.placa}
          </p>
          <p>
            <b>Velocidade:</b> {Math.floor(Number(vehicleConsultData.speed))}{' '}
            Km/H
          </p>
          <p>
            <b>Ignição:</b> {vehicleConsultData.ligado ? 'Ligado' : 'Desligado'}
          </p>
        </div>
      )}
    </form>
  )
}
