import { useForm, Controller } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as models from '@/domains/erp/inventory/Registration/Models'
import * as products from '@/domains/erp/purchases/Products'
import * as manufacturers from '@/domains/erp/inventory/Registration/Manufacturers'

import { useEffect } from 'react'
import { GraphQLTypes } from 'graphql/generated/zeus'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'
import { useRouter } from 'next/router'
import rotas from '@/domains/routes'

export default function UpdateModel() {
  const router = useRouter()
  const {
    updateModelLoading,
    updateModel,
    setSlidePanelState,
    slidePanelState,
    modelsRefetch,
    modelSchema
  } = models.useModel()
  const { productsData } = products.useList()
  const { manufacturersData } = manufacturers.useManufacturer()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control
  } = useForm({
    resolver: yupResolver(modelSchema)
  })
  const onSubmit = (formData: GraphQLTypes['estoque_Modelos']) => {
    updateModel({
      variables: {
        Id: slidePanelState.data?.Id,
        Nome: formData.Nome,
        Descricao: formData.Descricao,
        Produto_Id: formData.Produto_Id.key,
        Fabricante_Id: formData.Fabricante_Id.key
      }
    })
      .then(() => {
        modelsRefetch()
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
      Produto_Id: {
        key: slidePanelState.data?.Produto.Id,
        title: slidePanelState.data?.Produto.Nome
      },
      Fabricante_Id: {
        key: slidePanelState.data?.Fabricante.Id,
        title: slidePanelState.data?.Fabricante.Nome
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
          name="Produto_Id"
          render={({ field: { onChange, value } }) => (
            <div>
              <form.Select
                itens={
                  productsData
                    ? productsData.map((item) => {
                        return {
                          key: item,
                          title: item.Nome
                        }
                      })
                    : []
                }
                value={value}
                onChange={onChange}
                error={errors.Produto}
                label="Produto"
              />
              <common.OpenModalLink
                onClick={() => {
                  router.push(rotas.erp.compras.produtos.cadastrar)
                }}
              >
                Cadastrar produto
              </common.OpenModalLink>
            </div>
          )}
        />
        <Controller
          control={control}
          name="Fabricante_Id"
          render={({ field: { onChange, value } }) => (
            <div>
              <form.Select
                itens={
                  manufacturersData
                    ? manufacturersData.map((item) => {
                        return { key: item.Id, title: item.Nome }
                      })
                    : []
                }
                value={value}
                onChange={onChange}
                error={errors.Fabricante}
                label="Fabricante"
              />
              <common.OpenModalLink
                onClick={() => {
                  router.push(rotas.erp.estoque.cadastros.fabricantes)
                }}
              >
                Cadastrar fabricante
              </common.OpenModalLink>
            </div>
          )}
        />
      </div>
      <common.Separator />
      <buttons.PrimaryButton
        title="Salvar"
        disabled={updateModelLoading}
        loading={updateModelLoading}
      />
    </form>
  )
}
