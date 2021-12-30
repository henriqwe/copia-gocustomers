import { useEffect, useState } from 'react'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as services from '@/domains/erp/commercial/Services'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

type FormData = {
  Nome: string
  Categorias: {
    key: string
    title: string
  }[]
  Tipo: {
    key: string
    title: string
  }
}

export default function UpdateService() {
  const [activeEdit, setActiveEdit] = useState(false)
  const {
    updateServiceLoading,
    updateService,
    serviceData,
    serviceRefetch,
    serviceSchema,
    vehicleCategoriesData,
    serviceTypesData
  } = services.useUpdate()

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    control
  } = useForm({ resolver: yupResolver(serviceSchema) })

  function onSubmit(formData: FormData) {
    updateService({
      variables: {
        Id: serviceData?.Id,
        Nome: formData.Nome,
        Categorias: formData.Categorias,
        Tipo_Id: formData.Tipo.key
      }
    })
      .then(() => {
        serviceRefetch()
        setActiveEdit(false)
        notification(formData.Nome + ' editado com sucesso', 'success')
      })
      .catch((err) => {
        showError(err)
      })
  }

  useEffect(() => {
    reset({
      Nome: serviceData?.Nome || '',
      Categorias: serviceData?.Categorias,
      Tipo: {
        key: serviceData?.Tipo.Valor,
        title: serviceData?.Tipo.Comentario
      }
    })
  }, [serviceData, reset])

  return (
    <div className="flex flex-col gap-4">
      <common.Card>
        <common.GenericTitle
          title="Dados gerais"
          subtitle="Dados básicos do produto"
          className="px-6"
        />
        <common.Separator className="mb-0" />
        <form>
          <form.FormLine position={1} grid={3}>
            <form.Input
              fieldName="Nome"
              title="Nome"
              register={register}
              error={errors.Nome}
              disabled={!activeEdit}
            />
            <Controller
              control={control}
              name="Categorias"
              render={({ field: { onChange, value } }) => (
                <div>
                  <form.MultiSelect
                    itens={
                      vehicleCategoriesData
                        ? vehicleCategoriesData.map((vehicleCategory) => {
                            return {
                              key: vehicleCategory.Id,
                              title: vehicleCategory.Nome
                            }
                          })
                        : []
                    }
                    value={value}
                    onChange={onChange}
                    error={errors.Categorias}
                    disabled={!activeEdit}
                    label="Categorias"
                    edit={true}
                  />
                </div>
              )}
            />
            <Controller
              control={control}
              name="Tipo"
              render={({ field: { onChange, value } }) => (
                <div>
                  <form.Select
                    itens={
                      serviceTypesData
                        ? serviceTypesData.map((serviceType) => {
                            return {
                              key: serviceType.Valor,
                              title: serviceType.Comentario
                            }
                          })
                        : []
                    }
                    value={value}
                    onChange={onChange}
                    error={errors.Tipo}
                    label="Tipo"
                    disabled={!activeEdit}
                  />
                </div>
              )}
            />
          </form.FormLine>

          <div className="flex items-center justify-between w-full px-6">
            <buttons.GoBackButton />
            <div className="flex gap-2">
              {activeEdit && (
                <buttons.CancelButton
                  onClick={() => {
                    setActiveEdit(false)
                  }}
                />
              )}
              <buttons.PrimaryButton
                title={activeEdit ? 'Atualizar' : 'Editar'}
                disabled={updateServiceLoading}
                loading={updateServiceLoading}
                onClick={() => {
                  event?.preventDefault()
                  if (!activeEdit) {
                    setActiveEdit(true)
                    return
                  }
                  handleSubmit(onSubmit)()
                }}
              />
            </div>
          </div>
        </form>
      </common.Card>
    </div>
  )
}
