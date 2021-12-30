import { Controller, useForm } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as services from '@/domains/erp/identities/Providers/Tabs/Services'

import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'
import { BRLMoneyInputFormat, BRLMoneyUnformat } from 'utils/formaters'

type FormData = {
  Id: string
  Valor: number
  Servico_Id: {
    key: string
    title: string
  }
}

export default function CreateService() {
  const {
    createServiceLoading,
    createService,
    setSlidePanelState,
    slidePanelState,
    servicesRefetch,
    serviceSchema,
    commercialServicesRefetch
  } = services.useService()
  const {
    handleSubmit,
    formState: { errors },
    control
  } = useForm({
    resolver: yupResolver(serviceSchema)
  })
  const onSubmit = (formData: FormData) => {
    createService({
      variables: {
        Valor: BRLMoneyUnformat(formData.Valor),
        Servico_Id: slidePanelState.data?.Id
      }
    })
      .then(() => {
        servicesRefetch()
        commercialServicesRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false }
        })
        notification('Serviço cadastrado com sucesso', 'success')
      })
      .catch((err) => {
        showError(err)
      })
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
          name="Valor"
          render={({ field: { onChange, value } }) => (
            <form.Input
              fieldName="Valor"
              title="Valor (R$)"
              value={value}
              onChange={(e) => {
                onChange(BRLMoneyInputFormat(e))
              }}
              error={errors.Valor}
            />
          )}
        />
      </div>
      <common.Separator />
      <buttons.PrimaryButton
        title="Ativar"
        disabled={createServiceLoading}
        loading={createServiceLoading}
      />
    </form>
  )
}
