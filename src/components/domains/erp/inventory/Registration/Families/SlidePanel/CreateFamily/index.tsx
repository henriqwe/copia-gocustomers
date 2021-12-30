import { Controller, useForm } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as families from '@/domains/erp/inventory/Registration/Families'

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

export default function CreateFamily() {
  const {
    familySchema,
    createFamilyLoading,
    createFamily,
    setSlidePanelState,
    familiesRefetch,
    parentsFamiliesData,
    parentsFamiliesRefetch
  } = families.useFamily()
  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm({
    resolver: yupResolver(familySchema)
  })
  const onSubmit = (formData: FormData) => {
    createFamily({
      variables: {
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
        notification(formData.Nome + ' cadastrado com sucesso', 'success')
      })
      .catch((err) => {
        showError(err)
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
          fieldName="Nome"
          register={register}
          title="Nome"
          error={errors.Nome}
          data-testid="inserirNome"
        />
        <form.Input
          fieldName="Descricao"
          register={register}
          title="Descrição"
          error={errors.Descricao}
          data-testid="inserirDescricao"
        />

        {parentsFamiliesData?.length ? (
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
                value={value}
                onChange={onChange}
                label="Família pertencente (opcional)"
              />
            )}
          />
        ) : null}
      </div>
      <common.Separator />
      <buttons.PrimaryButton
        title="Enviar"
        disabled={createFamilyLoading}
        loading={createFamilyLoading}
      />
    </form>
  )
}
