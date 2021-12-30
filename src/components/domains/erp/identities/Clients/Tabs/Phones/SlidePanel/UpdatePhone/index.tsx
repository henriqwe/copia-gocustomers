import { Controller, useForm } from 'react-hook-form'
import React, { useEffect } from 'react'

import { GraphQLTypes } from 'graphql/generated/zeus'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'

import { notification } from 'utils/notification'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as phones from '@/domains/erp/identities/Clients/Tabs/Phones'
import { capitalizeWord, phoneUnformat, phoneFormat } from 'utils/formaters'
import { showError } from 'utils/showError'

export default function UpdatePhone() {
  const {
    setSlidePanelState,
    slidePanelState,
    updatePhone,
    phoneSchema,
    phonesRefetch,
    phonesLoading
  } = phones.usePhone()
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(phoneSchema)
  })
  const onSubmit = (formData: GraphQLTypes['contatos_Telefones']) => {
    updatePhone({
      variables: {
        Id: slidePanelState.data?.Id,
        Telefone: phoneUnformat(formData.Telefone),
        Categorias: [`${formData.Categorias.key}`],
        NomeDoResponsavel: formData.NomeDoResponsavel
      }
    })
      .then(() => {
        phonesRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false }
        })
        notification('Telefone editado com sucesso', 'success')
      })
      .catch((err) => {
        showError(err)
      })
  }

  useEffect(() => {
    reset({
      Telefone: phoneFormat(slidePanelState.data?.Telefone) || '',
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
        <form.BRPhoneInput
          error={errors.Telefone}
          register={register}
          control={control}
        />

        <div className="flex flex-col w-full gap-2 mb-2">
          <form.Input
            fieldName="NomeDoResponsavel"
            register={register}
            title="Responsável"
            error={errors.NomeDoResponsavel}
            data-testid="cadastrarNomeDoResponsavel"
          />
        </div>
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
        title="Salvar"
        disabled={phonesLoading}
        loading={phonesLoading}
      />
    </form>
  )
}
