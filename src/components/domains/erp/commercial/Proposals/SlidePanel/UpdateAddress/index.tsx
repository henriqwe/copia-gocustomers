import { useForm } from 'react-hook-form'
import React, { useEffect, useState } from 'react'

import { GraphQLTypes } from 'graphql/generated/zeus'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'

import * as proposals from '@/domains/erp/commercial/Proposals'
import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import { CEPunformat } from 'utils/formaters'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function UpdateAddress() {
  const [CEPData, setCEPData] = useState({
    bairro: '',
    logradouro: '',
    localidade: '',
    uf: ''
  })
  const [CEP, setCEP] = useState('')
  const {
    slidePanelState,
    setSlidePanelState,
    addressSchema,
    proposalRefetch,
    updateProposalInstalation,
    updateProposalInstalationLoading,
    proposalInstallationsRefetch
  } = proposals.useView()
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
    updateProposalInstalation({
      variables: {
        Id: slidePanelState.data?.Id,
        Endereco: formData,
        Veiculo_Id: slidePanelState.data?.Veiculo_Id
      }
    })
      .then(() => {
        proposalRefetch()
        proposalInstallationsRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false }
        })
        notification('Endereço redefinido com sucesso', 'success')
      })
      .catch((err) => {
        showError(err)
      })
  }

  useEffect(() => {
    if (CEPData.bairro !== '') {
      reset({
        Bairro: CEPData.bairro,
        Logradouro: CEPData.logradouro,
        Cep: CEP,
        Cidade: CEPData.localidade,
        Estado: CEPData.uf
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
      Bairro: slidePanelState.data?.Endereco.Bairro || '',
      Logradouro: slidePanelState.data?.Endereco.Logradouro || '',
      Numero: slidePanelState.data?.Endereco.Numero || '',
      Cep: slidePanelState.data?.Endereco.Cep || '',
      Complemento: slidePanelState.data?.Endereco.Complemento || '',
      Cidade: slidePanelState.data?.Endereco.Cidade || '',
      Estado: slidePanelState.data?.Endereco.Estado || ''
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
          control={control}
          onCompleteZipCode={setCEP}
        />
        <common.Separator />
        <form.Input
          fieldName="Logradouro"
          register={register}
          title="Logradouro"
          error={errors.Logradouro}
          disabled
        />
        <form.Input
          fieldName="Bairro"
          register={register}
          title="Bairro"
          error={errors.Bairro}
          disabled
        />
        <form.Input
          fieldName="Cidade"
          register={register}
          title="Cidade"
          error={errors.Cidade}
          disabled
        />
        <form.Input
          fieldName="Estado"
          register={register}
          title="Estado"
          error={errors.Estado}
          disabled
        />
        <form.Input
          fieldName="Numero"
          register={register}
          title="Número"
          error={errors.Numero}
        />

        <form.Input
          fieldName="Complemento"
          register={register}
          title="Complemento"
          error={errors.Complemento}
        />
      </div>
      <common.Separator />
      <buttons.PrimaryButton
        title="Atualizar"
        disabled={updateProposalInstalationLoading}
        loading={updateProposalInstalationLoading}
      />
    </form>
  )
}
