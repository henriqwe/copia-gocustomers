import { Controller, useForm } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as actions from '@/domains/erp/services/Registration/Actions'
import * as flowStages from '@/domains/erp/services/Registration/Flows/Stage'
import rotasArray from '@/domains/routesArray'

import { useEffect } from 'react'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

type FormData = {
  Url: { key: string; title: string }
  Titulo: string
  Etapas_Id: { key: string; title: string }[]
}

export default function UpdateAction() {
  const {
    updateActionLoading,
    updateAction,
    setSlidePanelState,
    slidePanelState,
    actionsRefetch,
    actionSchema
  } = actions.useAction()
  const { stagesData } = flowStages.useStage()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control
  } = useForm({
    resolver: yupResolver(actionSchema)
  })
  const onSubmit = (formData: FormData) => {
    updateAction({
      variables: {
        Id: slidePanelState.data?.Id,
        Titulo: formData.Titulo,
        Url: formData.Url.key,
        Etapas_Id: formData.Etapas_Id
      }
    })
      .then(() => {
        actionsRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false }
        })
        notification(formData.Titulo + ' editado com sucesso', 'success')
      })
      .catch((err) => {
        showError(err)
      })
  }

  useEffect(() => {
    reset({
      Titulo: slidePanelState.data?.Titulo || '',
      Url: {
        key: slidePanelState.data?.Url || '',
        title: slidePanelState.data?.Url || ''
      },
      Etapas_Id: slidePanelState.data?.Etapas_Id
    })
  }, [slidePanelState.data, reset])

  console.log(slidePanelState.data?.Etapas_Id)

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      data-testid="editForm"
      className="flex flex-col items-end"
    >
      <div className="flex flex-col w-full gap-2 mb-2">
        <form.Input
          fieldName="Titulo"
          register={register}
          title="Título"
          error={errors.Titulo}
          data-testid="editTitulo"
        />
        <Controller
          control={control}
          name={'Url'}
          render={({ field: { onChange, value } }) => (
            <div>
              <form.Select
                itens={rotasArray.map((route) => {
                  return { key: route, title: route }
                })}
                value={value}
                onChange={onChange}
                error={errors.Url}
                label="Url"
              />
            </div>
          )}
        />
        <Controller
          control={control}
          name="Etapas_Id"
          render={({ field: { onChange, value } }) => (
            <div>
              <form.MultiSelect
                itens={
                  stagesData
                    ? stagesData.map((stage) => {
                        return {
                          key: stage.Id,
                          title: stage.Nome
                        }
                      })
                    : []
                }
                value={value}
                onChange={onChange}
                error={errors.Etapas_Id}
                label="Etapas"
                edit={true}
              />
            </div>
          )}
        />
      </div>
      <common.Separator />
      <buttons.PrimaryButton
        title="Editar"
        disabled={updateActionLoading}
        loading={updateActionLoading}
      />
    </form>
  )
}
