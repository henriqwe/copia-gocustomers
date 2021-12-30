import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { GraphQLTypes } from 'graphql/generated/zeus'

import { notification } from 'utils/notification'
import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'

import * as clients from '@/domains/erp/identities/Clients'
import * as phones from '@/domains/erp/identities/Clients/Tabs/Phones'
import { phoneUnformat } from 'utils/formaters'
import { showError } from 'utils/showError'

export default function CreatePhone() {
  const {
    setSlidePanelState,
    createPhone,
    createPhoneLoading,
    phonesRefetch,
    phoneSchema
  } = phones.usePhone()
  const { clientData } = clients.useUpdate()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(phoneSchema)
  })
  const onSubmit = (formData: GraphQLTypes['contatos_Telefones']) => {
    createPhone({
      variables: {
        Telefone: phoneUnformat(formData.Telefone),
        Identidades: { cliente: clientData?.Id },
        Categorias: [`${formData.Categorias.key}`],
        NomeDoResponsavel: formData.NomeDoResponsavel
      }
    })
      .then(() => {
        phonesRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false }
        })
        notification('Telefone cadastrado com sucesso', 'success')
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
        <form.BRPhoneInput error={errors.Telefone} control={control} />
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
                { key: 'comercial', title: 'Comercial' },
                { key: 'residencial', title: 'Residencial' }
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
        disabled={createPhoneLoading}
        loading={createPhoneLoading}
      />
    </form>
  )
}
