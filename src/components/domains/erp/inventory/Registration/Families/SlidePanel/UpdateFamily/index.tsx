import { Controller, useForm } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as families from '@/domains/erp/inventory/Registration/Families'

import { useEffect } from 'react'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

type FormData = {
  Nome: string
  Descricao: string
  Pai: {
    key: string
  }
}

export default function UpdateFamily() {
  const {
    updateFamilyLoading,
    updateFamily,
    setSlidePanelState,
    slidePanelState,
    familiesRefetch,
    familySchema,
    parentsFamiliesData,
    parentsFamiliesRefetch
  } = families.useFamily()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control
  } = useForm({
    resolver: yupResolver(familySchema)
  })
  const onSubmit = (formData: FormData) => {
    updateFamily({
      variables: {
        Id: slidePanelState.data?.Id,
        Nome: formData.Nome,
        Descricao: formData.Descricao,
        Pai_Id: formData.Pai ? formData.Pai.key : null
      }
    })
      .then(() => {
        familiesRefetch()
        parentsFamiliesRefetch()
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
      Nome: slidePanelState.data?.Nome,
      Descricao: slidePanelState.data?.Descricao,
      Pai: {
        key: slidePanelState.data?.Pai ? slidePanelState.data?.Pai?.Id : null,
        title: slidePanelState.data?.Pai
          ? slidePanelState.data?.Pai?.Nome
          : 'Família pertencente (opcional)'
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
          title="Nome"
          error={errors.Nome}
          data-testid="editNome"
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
          name="Pai"
          render={({ field: { onChange, value } }) => (
            <form.SelectWithGroup
              itens={
                parentsFamiliesData
                  ? parentsFamiliesData.map((item) => {
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
              bloqued={[slidePanelState.data?.Id]}
              value={value}
              onChange={onChange}
              label="Família pertencente (opcional)"
            />
          )}
        />
      </div>
      <common.Separator />
      <buttons.PrimaryButton
        title="Salvar"
        disabled={updateFamilyLoading}
        loading={updateFamilyLoading}
      />
    </form>
  )
}
