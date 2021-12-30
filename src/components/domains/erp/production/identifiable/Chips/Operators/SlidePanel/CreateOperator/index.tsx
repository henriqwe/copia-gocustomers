import { useForm } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as operators from '@/domains/erp/production/identifiable/Chips/Operators'

import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { GraphQLTypes } from 'graphql/generated/zeus'
import { notification } from 'utils/notification'

export default function CreateOperator() {
  const {
    createOperatorLoading,
    createOperator,
    setSlidePanelState,
    operatorsRefetch,
    operatorSchema
  } = operators.useOperator()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(operatorSchema)
  })
  const onSubmit = (formData: GraphQLTypes['Operadoras']) => {
    createOperator({
      variables: {
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
        notification(formData.Nome + ' cadastrado com sucesso', 'success')
      })
      .catch((err) => {
        notification(err.message, 'error')
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
        title="Enviar"
        disabled={createOperatorLoading}
        loading={createOperatorLoading}
      />
    </form>
  )
}
