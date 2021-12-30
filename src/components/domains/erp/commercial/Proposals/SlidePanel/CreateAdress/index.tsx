import { useState, useEffect } from 'react'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'

import { notification } from 'utils/notification'
import { showError } from 'utils/showError'
import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as proposals from '@/domains/erp/commercial/Proposals'

type FormData = {
  Bairro: string
  Logradouro: string
  Cep: string
  Cidade: string
  Estado: string
  Numero: string
  Complemento: string
}

export default function CreateAddress() {
  const [CEPData, setCEPData] = useState({
    bairro: '',
    logradouro: '',
    localidade: '',
    uf: ''
  })
  const [CEP, setCEP] = useState('')
  const {
    createProposalInstalation,
    createProposalInstalationLoading,
    proposalRefetch,
    setSlidePanelState,
    addressSchema,
    slidePanelState,
    proposalInstallationsRefetch
  } = proposals.useView()
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset
  } = useForm({
    resolver: yupResolver(addressSchema)
  })
  const onSubmit = (formData: FormData) => {
    createProposalInstalation({
      variables: {
        Endereco: formData,
        Veiculo_Id: slidePanelState.data?.Veiculo_Id,
        Veiculo: slidePanelState.data?.Veiculo
      }
    })
      .then(() => {
        proposalRefetch()
        proposalInstallationsRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false }
        })
        notification('Endereço definido com sucesso', 'success')
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
      setCEP(CEP.split('-').join(''))
      fetch(`http://viacep.com.br/ws/${CEP}/json/`)
        .then((response) => response.json())
        .then((data) => setCEPData(data))
        .catch((err) => showError(err))
    }
  }, [CEP])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      data-testid="inserirForm"
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
        title="Enviar"
        disabled={createProposalInstalationLoading}
        loading={createProposalInstalationLoading}
      />
    </form>
  )
}
