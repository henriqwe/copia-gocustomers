import { Controller, useForm } from 'react-hook-form'
import React, { useEffect, useState } from 'react'

import { GraphQLTypes } from 'graphql/generated/zeus'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'

import * as addresses from '@/domains/erp/identities/Clients/Tabs/Addresses'
import * as clients from '@/domains/erp/identities/Clients'
import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import { CEPunformat } from 'utils/formaters'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function UpdateAddress() {
  const [cidades, setCidades] = useState<{ Id: string; Nome: string }[]>([])
  const [CEPData, setCEPData] = useState({ bairro: '', logradouro: '' })
  const [stateId, setstateId] = useState('')
  const [CEP, setCEP] = useState('')
  const { clientData } = clients.useUpdate()
  const {
    slidePanelState,
    setSlidePanelState,
    updateAddress,
    addressSchema,
    addressesRefetch,
    addressesLoading,
    statesData,
    getCities
  } = addresses.useAddress()
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(addressSchema)
  })
  const onSubmit = (formData: GraphQLTypes['contatos_Enderecos']) => {
    updateAddress({
      variables: {
        Id: slidePanelState.data?.Id,
        Bairro: formData.Bairro,
        Logradouro: formData.Logradouro,
        Numero: formData.Numero,
        Cep: formData.Cep,
        Complemento: formData.Complemento,
        Estado_Id: formData.Estado_Id.key,
        Cidade_Id: formData.Cidade_Id.key,
        Identidades: { cliente: clientData?.Id }
      }
    })
      .then(() => {
        addressesRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false }
        })
        notification('Endereço editado com sucesso', 'success')
      })
      .catch((err) => {
        showError(err)
      })
  }

  useEffect(() => {
    if (stateId !== '') {
      getCities(stateId).then((data) => {
        setCidades(data)
      })
      return
    }
    getCities(slidePanelState.data?.Estado.Id).then((data) => {
      setCidades(data)
    })
  }, [getCities, stateId, slidePanelState.data?.Estado.Id])

  useEffect(() => {
    if (CEPData.bairro !== '') {
      reset({
        Bairro: CEPData.bairro,
        Logradouro: CEPData.logradouro,
        Cep: CEP
      })
    }
  }, [reset, CEPData])

  useEffect(() => {
    if (CEP !== '') {
      setCEP(CEPunformat(CEP))
      fetch(`http://viacep.com.br/ws/${CEP}/json/`)
        .then((response) => response.json())
        .then((data) => setCEPData(data))
        .catch((err) => showError(err))
    }
  }, [CEP])

  useEffect(() => {
    reset({
      Bairro: slidePanelState.data?.Bairro || '',
      Logradouro: slidePanelState.data?.Logradouro || '',
      Numero: slidePanelState.data?.Numero || '',
      Cep: slidePanelState.data?.Cep || '',
      Complemento: slidePanelState.data?.Complemento || '',
      Estado_Id: {
        key: slidePanelState.data?.Estado.Id || '',
        title: slidePanelState.data?.Estado.Nome || ''
      },
      Cidade_Id: {
        key: slidePanelState.data?.Cidade.Id || '',
        title: slidePanelState.data?.Cidade.Nome || ''
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
        <form.ZipCodeInput
          register={register}
          error={errors.Cep}
          data-testid="inserirCep"
          control={control}
          onCompleteZipCode={setCEP}
        />
        <common.Separator />
        <form.Input
          fieldName="Bairro"
          register={register}
          title="Bairro"
          error={errors.Bairro}
          data-testid="inserirBairro"
        />
        <form.Input
          fieldName="Logradouro"
          register={register}
          title="Logradouro"
          error={errors.Logradouro}
          data-testid="inserirLogradouro"
        />
        <form.Input
          fieldName="Numero"
          register={register}
          title="Número"
          error={errors.Numero}
          data-testid="inserirNumero"
        />

        <form.Input
          fieldName="Complemento"
          register={register}
          title="Complemento"
          error={errors.Complemento}
          data-testid="inserirComplemento"
        />

        <Controller
          control={control}
          name="Estado_Id"
          render={({ field: { onChange, value } }) => (
            <div className="col-span-3">
              <form.Select
                itens={
                  statesData
                    ? statesData.map((item) => {
                        return { key: item.Id, title: item.Nome }
                      })
                    : []
                }
                value={value}
                onChange={(estado) => {
                  setstateId(estado.key as string)
                  onChange(estado)
                }}
                error={errors.Estado_Id}
                label="Estado"
              />
            </div>
          )}
        />

        <Controller
          control={control}
          name="Cidade_Id"
          render={({ field: { onChange, value } }) => (
            <div className="col-span-3">
              <form.Select
                itens={
                  cidades
                    ? cidades.map((item) => {
                        return { key: item.Id, title: item.Nome }
                      })
                    : []
                }
                value={value}
                onChange={onChange}
                error={errors.Cidade_Id}
                label="Cidade"
              />
            </div>
          )}
        />
      </div>
      <common.Separator />
      <buttons.PrimaryButton
        title="Salvar"
        disabled={addressesLoading}
        loading={addressesLoading}
      />
    </form>
  )
}
