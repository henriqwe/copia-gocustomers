import { useForm } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as manufacturers from '@/domains/erp/inventory/Registration/Manufacturers'

import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { GraphQLTypes } from 'graphql/generated/zeus'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function CreateManufacturer() {
  const {
    createManufacturerLoading,
    createManufacturer,
    setSlidePanelState,
    manufacturersRefetch,
    manufacturerSchema
  } = manufacturers.useManufacturer()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(manufacturerSchema)
  })
  const onSubmit = (formData: GraphQLTypes['estoque_Fabricantes']) => {
    createManufacturer({
      variables: {
        Nome: formData.Nome,
        Descricao: formData.Descricao
      }
    })
      .then(() => {
        manufacturersRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false }
        })
        notification(formData.Nome + ' cadastrado com sucesso', 'success')
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
        <form.Input
          fieldName="Nome"
          register={register}
          title="Nome"
          error={errors.Nome}
          data-testid="inserirNome"
        />
        <form.Input
          fieldName="Descricao"
          register={register}
          title="Descrição"
          error={errors.Descricao}
          data-testid="inserirDescricao"
        />
      </div>
      <common.Separator />
      <buttons.PrimaryButton
        title="Enviar"
        disabled={createManufacturerLoading}
        loading={createManufacturerLoading}
      />
    </form>
  )
}
