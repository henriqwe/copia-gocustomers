import { useEffect, useState } from 'react'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as providers from '@/domains/erp/commercial/Providers'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

type FormData = {
  Id: string
  Nome: string
}

export default function UpdateProvider() {
  const [edicaoAtivada, setEdicaoAtivada] = useState(false)
  const {
    updateProviderLoading,
    updateProvider,
    providerData,
    providerRefetch,
    providerSchema
  } = providers.useUpdate()

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm({ resolver: yupResolver(providerSchema) })

  function onSubmit(formData: FormData) {
    updateProvider({
      variables: {
        Id: providerData?.Id,
        Nome: formData.Nome
      }
    })
      .then(() => {
        providerRefetch()
        notification(formData.Nome + ' editado com sucesso', 'success')
      })
      .catch((err) => {
        showError(err)
      })
  }

  useEffect(() => {
    reset({
      Nome: providerData?.Nome || ''
    })
  }, [providerData, reset])

  return (
    <div className="flex flex-col gap-4">
      <common.Card>
        <common.GenericTitle
          title="Dados gerais"
          subtitle="Dados básicos do Fornecedor"
          className="px-6"
        />
        <common.Separator className="mb-0" />
        <form>
          <form.FormLine position={1} grid={2}>
            <form.Input
              fieldName="Nome"
              title="Nome"
              register={register}
              error={errors.Nome}
              disabled={!edicaoAtivada}
            />
          </form.FormLine>

          <div className="flex items-center justify-between w-full px-6">
            <buttons.GoBackButton />
            <div className="flex gap-2">
              {edicaoAtivada && (
                <buttons.CancelButton
                  onClick={() => {
                    setEdicaoAtivada(false)
                  }}
                />
              )}
              <buttons.PrimaryButton
                title={edicaoAtivada ? 'Atualizar' : 'Editar'}
                disabled={updateProviderLoading}
                loading={updateProviderLoading}
                onClick={() => {
                  event?.preventDefault()
                  if (!edicaoAtivada) {
                    setEdicaoAtivada(true)
                    return
                  }
                  handleSubmit(onSubmit)()
                }}
              />
            </div>
          </div>
        </form>
      </common.Card>
    </div>
  )
}
