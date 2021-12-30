import { useForm } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as identifiers from '@/domains/erp/production/identifiable/Identifiers'

import { useEffect } from 'react'
import { GraphQLTypes } from 'graphql/generated/zeus'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function UpdateIdentifier() {
  const {
    updateIdentifierLoading,
    updateIdentifier,
    setSlidePanelState,
    slidePanelState,
    identifiersRefetch,
    identifierSchema
  } = identifiers.useIdentifier()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(identifierSchema)
  })
  const onSubmit = (formData: GraphQLTypes['producao_Identificadores']) => {
    updateIdentifier({
      variables: {
        Id: slidePanelState.data?.Id,
        CodigoIdentificador: formData.CodigoIdentificador
      }
    })
      .then(() => {
        identifiersRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false }
        })
        notification(
          formData.CodigoIdentificador + ' editado com sucesso',
          'success'
        )
      })
      .catch((err) => {
        showError(err)
      })
  }

  useEffect(() => {
    reset({
      CodigoIdentificador: slidePanelState.data?.CodigoIdentificador || ''
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
          fieldName="CodigoIdentificador"
          register={register}
          title="Número do Código"
          error={errors.CodigoIdentificador}
        />
      </div>
      <common.Separator />
      <buttons.PrimaryButton
        title="Editar"
        disabled={updateIdentifierLoading}
        loading={updateIdentifierLoading}
      />
    </form>
  )
}
