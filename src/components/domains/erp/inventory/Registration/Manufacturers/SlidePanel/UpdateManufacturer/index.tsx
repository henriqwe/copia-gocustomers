import { useForm } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as manufacturers from '@/domains/erp/inventory/Registration/Manufacturers'

import { useEffect } from 'react'
import { GraphQLTypes } from 'graphql/generated/zeus'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function UpdateManufacturer() {
  const {
    updateManufacturerLoading,
    updateManufacturer,
    setSlidePanelState,
    slidePanelState,
    manufacturersRefetch,
    manufacturerSchema
  } = manufacturers.useManufacturer()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(manufacturerSchema)
  })
  const onSubmit = (formData: GraphQLTypes['estoque_Fabricantes']) => {
    updateManufacturer({
      variables: {
        Id: slidePanelState.data?.Id,
        Nome: formData.Nome,
        Descricao: formData.Descricao
      }
    })
      .then(() => {
        manufacturersRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false }
        })
        notification(formData.Nome + ' editado com sucesso', 'success')
      })
      .catch((err) => {
        showError(err)
      })
  }
  useEffect(() => {
    reset({
      Nome: slidePanelState.data?.Nome,
      Descricao: slidePanelState.data?.Descricao
    })
  }, [slidePanelState.data, reset])
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      data-testid="editForm"
      className="flex flex-col items-end"
    >
      <div className="flex flex-col w-full gap-2 mb-2">
        <form.Input
          fieldName="Nome"
          register={register}
          title="Nome"
          error={errors.Nome}
          data-testid="editNome"
        />
        <form.Input
          fieldName="Descricao"
          register={register}
          title="Descrição"
          error={errors.Descricao}
          data-testid="editDescricao"
        />
      </div>
      <common.Separator />
      <buttons.PrimaryButton
        title="Salvar"
        disabled={updateManufacturerLoading}
        loading={updateManufacturerLoading}
      />
    </form>
  )
}
