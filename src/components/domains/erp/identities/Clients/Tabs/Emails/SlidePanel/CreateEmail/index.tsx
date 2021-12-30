import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { GraphQLTypes } from 'graphql/generated/zeus'

import { notification } from 'utils/notification'
import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'

import * as client from '@/domains/erp/identities/Clients'
import * as emails from '@/domains/erp/identities/Clients/Tabs/Emails'
import { showError } from 'utils/showError'

export default function CreateEmail() {
  const {
    setSlidePanelState,
    createEmail,
    createEmailLoading,
    emailsRefetch,
    emailSchema
  } = emails.useEmail()
  const { clientData } = client.useUpdate()
  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(emailSchema)
  })
  const onSubmit = (formData: GraphQLTypes['contatos_Emails']) => {
    createEmail({
      variables: {
        Email: formData.Email,
        Categorias: [`${formData.Categorias.key}`],
        NomeDoResponsavel: formData.NomeDoResponsavel,
        Identidades: { cliente: clientData?.Id }
      }
    })
      .then(() => {
        emailsRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false }
        })
        notification('Email cadastrado com sucesso', 'success')
      })
      .catch((erros) => {
        showError(erros)
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
          fieldName="Email"
          register={register}
          title="Email"
          error={errors.Email}
          data-testid="createEmail"
        />
      </div>
      <div className="flex flex-col w-full gap-2 mb-2">
        <form.Input
          fieldName="NomeDoResponsavel"
          register={register}
          title="Responsável"
          error={errors.NomeDoResponsavel}
          data-testid="cadastrarNomeDoResponsavel"
        />
      </div>

      <Controller
        control={control}
        name="Categorias"
        render={({ field: { onChange, value } }) => (
          <div className="flex flex-col w-full gap-2 mb-2">
            <form.Select
              itens={[
                { key: 'financeiro', title: 'Financeiro' },
                { key: 'base', title: 'base' }
              ]}
              value={value}
              onChange={onChange}
              error={errors.Categorias}
              label="Categorias"
            />
          </div>
        )}
      />

      <common.Separator />

      <buttons.PrimaryButton
        title="Cadastrar"
        disabled={createEmailLoading}
        loading={createEmailLoading}
      />
    </form>
  )
}
