import { Controller, useForm } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as localizations from '@/domains/erp/monitoring/Localization'
import * as clients from '@/domains/erp/identities/Clients'

import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'
import router from 'next/router'
import rotas from '@/domains/routes'

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

export default function CreateLocalization() {
  const {
    createLocalizationLoading,
    createLocalization,
    setSlidePanelState,
    localizationsRefetch,
    localizationSchema,
    collaboratorsData,
    vehicleLocationInfo,
    allUserVehicle
  } = localizations.useLocalization()
  const { clientsData } = clients.useList()
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      data-testid="inserirForm"
      className="flex flex-col items-end"
    >
      <div className="flex flex-col w-full gap-2 mb-2">
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
                onChange={onChange}
                error={errors.Cliente_Id}
                label="Veiculos"
              />
            </div>
          )}
        />
      </div>
      <div className="flex justify-between w-full">
        <buttons.SecondaryButton
          title="Exibir no Mapa"
          handler={() => {
            return
          }}
          disabled={createLocalizationLoading}
          loading={createLocalizationLoading}
        />
        <buttons.PrimaryButton
          title="Consultar"
          disabled={createLocalizationLoading}
          loading={createLocalizationLoading}
        />
      </div>
    </form>
  )
}
