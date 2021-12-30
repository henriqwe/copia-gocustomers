import { useForm } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as addressingTypes from '@/domains/erp/inventory/Registration/Addresses/AddressingTypes'

import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { GraphQLTypes } from 'graphql/generated/zeus'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function CreateAddressingType() {
  const {
    createAddressingTypeLoading,
    createAddressingType,
    setSlidePanelState,
    addressingTypesRefetch,
    addressingTypesSchema
  } = addressingTypes.useAddressingType()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(addressingTypesSchema)
  })
  const onSubmit = (
    formData: GraphQLTypes['estoque_TiposDeEnderecamentos']
  ) => {
    createAddressingType({
      variables: {
        Nome: formData.Nome,
        Descricao: formData.Descricao,
        Slug: formData.Slug
      }
    })
      .then(() => {
        addressingTypesRefetch()
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
          fieldName="Slug"
          register={register}
          title="Slug"
          error={errors.Slug}
          data-testid="inserirSlug"
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
        disabled={createAddressingTypeLoading}
        loading={createAddressingTypeLoading}
      />
    </form>
  )
}
