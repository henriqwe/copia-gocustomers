import { Controller, useForm } from 'react-hook-form'
import React, { useEffect } from 'react'

import { GraphQLTypes } from 'graphql/generated/zeus'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'

import { notification } from 'utils/notification'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as emails from '@/domains/erp/identities/Clients/Tabs/Emails'
import { showError } from 'utils/showError'
import { capitalizeWord } from 'utils/formaters'

export default function UpdateEmail() {
  const {
    setSlidePanelState,
    slidePanelState,
    updateEmail,
    emailSchema,
    emailsRefetch,
    emailsLoading
  } = emails.useEmail()
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(emailSchema)
  })
  const onSubmit = (formData: GraphQLTypes['contatos_Emails']) => {
    updateEmail({
      variables: {
        Id: slidePanelState.data?.Id,
        Email: formData.Email,
        Categorias: [`${formData.Categorias.key}`],
        NomeDoResponsavel: formData.NomeDoResponsavel
      }
    })
      .then(() => {
        emailsRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false }
        })
        notification('Email editado com sucesso', 'success')
      })
      .catch((err) => {
        showError(err)
      })
  }

  useEffect(() => {
    reset({
      Email: slidePanelState.data?.Email || '',
      NomeDoResponsavel: slidePanelState.data?.NomeDoResponsavel || '',
      Categorias: {
        key: slidePanelState.data?.Categorias[0],
        title: capitalizeWord(slidePanelState.data?.Categorias[0])
      }
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
          fieldName="Email"
          register={register}
          title="Email"
          error={errors.Email}
          data-testid="cadastrarEmail"
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
        title="Salvar"
        disabled={emailsLoading}
        loading={emailsLoading}
      />
    </form>
  )
}
