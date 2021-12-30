import { useForm, Controller } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as addresses from '@/domains/erp/inventory/Registration/Addresses'
import * as addressingTypes from '@/domains/erp/inventory/Registration/Addresses/AddressingTypes'

import { useEffect } from 'react'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

type FormData = {
  Id: string
  Nome: string
  Descricao: string
  Tipo: {
    key: { Id: string; Slug: string; CodigoReferencia: string }
    titulo: string
  }
  Pai_Id: {
    key: string
    titulo: string
  }
}

export default function UpdateAddressing() {
  const { addressingTypesData } = addressingTypes.useAddressingType()
  const {
    updateAddressingLoading,
    updateAddressing,
    setSlidePanelState,
    slidePanelState,
    adresssesRefetch,
    addressingSchema,
    parentsAdressesData,
    parentsAdressesRefetch
  } = addresses.useAddressing()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
    watch
  } = useForm({
    resolver: yupResolver(addressingSchema)
  })
  const onSubmit = (formData: FormData) => {
    updateAddressing({
      variables: {
        Id: slidePanelState.data?.Id,
        Nome: formData.Tipo.key.Slug + formData.Tipo.key.CodigoReferencia,
        Descricao: formData.Descricao,
        Tipo_Id: formData.Tipo.key.Id,
        Pai_Id: formData.Pai_Id ? formData.Pai_Id.key : null
      }
    })
      .then(() => {
        adresssesRefetch()
        parentsAdressesRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false }
        })
        notification(formData.Nome + ' editado com sucesso', 'success')
      })
      .catch((err) => {
        showError(err)
      })
  }

  useEffect(() => {
    reset({
      Nome: slidePanelState.data?.Nome || '',
      Descricao: slidePanelState.data?.Descricao || '',
      Tipo: {
        key: slidePanelState.data?.Tipo || '',
        title: slidePanelState.data?.Tipo.Nome || ''
      },
      Pai_Id: {
        key: slidePanelState.data?.Pai ? slidePanelState.data?.Pai.Id : null,
        title: slidePanelState.data?.Pai
          ? slidePanelState.data?.Pai.Nome
          : 'Endereçamento pertencente (opcional)'
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
          fieldName="Nome"
          register={register}
          value={
            watch('Tipo')
              ? watch('Tipo').key.Slug + watch('Tipo').key.CodigoReferencia
              : ''
          }
          title="Nome"
          error={errors.Nome}
          data-testid="editNome"
          disabled
        />
        <form.Input
          fieldName="Descricao"
          register={register}
          title="Descrição"
          error={errors.Descricao}
          data-testid="editDescricao"
        />
        <Controller
          control={control}
          name="Tipo"
          render={({ field: { onChange, value } }) => (
            <form.Select
              itens={
                addressingTypesData
                  ? addressingTypesData.map((item) => {
                      return { key: item, title: item.Nome }
                    })
                  : []
              }
              value={value}
              onChange={onChange}
              error={errors.Tipo}
              label="Tipo"
            />
          )}
        />
        <Controller
          control={control}
          name="Pai_Id"
          render={({ field: { onChange, value } }) => (
            <form.SelectWithGroup
              itens={
                parentsAdressesData
                  ? parentsAdressesData.map((item) => {
                      return {
                        key: item.Id,
                        title: item.Nome,
                        children: item.Filhos?.map((filho) => {
                          return {
                            key: filho.Id,
                            title: filho.Nome,
                            children: filho.Filhos?.map((filho2) => {
                              return {
                                key: filho2.Id,
                                title: filho2.Nome,
                                children: []
                              }
                            })
                          }
                        })
                      }
                    })
                  : []
              }
              value={value}
              onChange={onChange}
              error={errors.Pai_Id}
              label="Endereçamento pertencente (opcional)"
            />
          )}
        />
      </div>
      <common.Separator />
      <buttons.PrimaryButton
        title="Editar"
        disabled={updateAddressingLoading}
        loading={updateAddressingLoading}
      />
    </form>
  )
}
