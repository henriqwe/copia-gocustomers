import { useForm } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as operators from '@/domains/erp/production/identifiable/Chips/Operators'

import { useEffect } from 'react'
import { GraphQLTypes } from 'graphql/generated/zeus'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { notification } from 'utils/notification'

export default function UpdateOperator() {
  const {
    updateOperatorLoading,
    updateOperator,
    setSlidePanelState,
    slidePanelState,
    operatorsRefetch,
    operatorSchema
  } = operators.useOperator()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(operatorSchema)
  })
  const onSubmit = (formData: GraphQLTypes['Operadoras']) => {
    updateOperator({
      variables: {
        Id: slidePanelState.data?.Id,
        Nome: formData.Nome,
        Apn: formData.Apn,
        Usuario: formData.Usuario,
        Senha: formData.Senha
      }
    })
      .then(() => {
        operatorsRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false }
        })
        notification(formData.Nome + ' editado com sucesso', 'success')
      })
      .catch((err) => {
        notification(err.message, 'error')
      })
  }

  useEffect(() => {
    reset({
      Nome: slidePanelState.data?.Nome || '',
      Apn: slidePanelState.data?.Apn || '',
      Usuario: slidePanelState.data?.Usuario || '',
      Senha: slidePanelState.data?.Senha || ''
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
          fieldName="Apn"
          register={register}
          title="Apn"
          error={errors.Apn}
          data-testid="inserirApn"
        />
        <form.Input
          fieldName="Usuario"
          register={register}
          title="Usuário"
          error={errors.Usuario}
          data-testid="inserirUsuario"
        />
        <form.Input
          fieldName="Senha"
          register={register}
          title="Senha"
          error={errors.Senha}
          data-testid="inserirSenha"
        />
      </div>
      <common.Separator />
      <buttons.PrimaryButton
        title="Editar"
        disabled={updateOperatorLoading}
        loading={updateOperatorLoading}
      />
    </form>
  )
}
