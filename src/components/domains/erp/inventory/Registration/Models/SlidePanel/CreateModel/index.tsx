import { useForm, Controller } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as models from '@/domains/erp/inventory/Registration/Models'
import * as produtos from '@/domains/erp/purchases/Products'
import * as manufacturers from '@/domains/erp/inventory/Registration/Manufacturers'

import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { GraphQLTypes } from 'graphql/generated/zeus'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'
import { useRouter } from 'next/router'
import rotas from '@/domains/routes'

type CreateModelProps = {
  extra?: () => void
}

export default function CreateModel({ extra = () => null }: CreateModelProps) {
  const router = useRouter()
  const {
    createModelLoading,
    createModel,
    setSlidePanelState,
    modelsRefetch,
    modelSchema
  } = models.useModel()
  const { productsData } = produtos.useList()
  const { manufacturersData } = manufacturers.useManufacturer()
  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm({
    resolver: yupResolver(modelSchema)
  })
  const onSubmit = (formData: GraphQLTypes['estoque_Modelos']) => {
    createModel({
      variables: {
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
        notification(formData.Nome + ' cadastrado com sucesso', 'success')
        extra()
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
                          key: item.Id,
                          title: item.Nome
                        }
                      })
                    : []
                }
                value={value}
                onChange={onChange}
                error={errors.Produto_Id}
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
                error={errors.Fabricante_Id}
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
        title="Enviar"
        disabled={createModelLoading}
        loading={createModelLoading}
      />
    </form>
  )
}
