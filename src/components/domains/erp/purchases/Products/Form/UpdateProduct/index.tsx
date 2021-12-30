import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'

import rotas from '@/domains/routes'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as product from '@/domains/erp/purchases/Products'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

type FormData = {
  Nome: string
  // Descricao: string
  Utilizacao: string
  UnidadeMedida: { key: string; titulo: string }
  Fabricantes: { key: string; titulo: string }
  NCM: number
}

const Formulario = () => {
  const [buttonName, setButtonName] = useState('Editar')
  const router = useRouter()
  const {
    productSchema,
    updateProductLoading,
    updateProduct,
    productData,
    productLoading,
    productRefetch,
    unitsOfMeasureData
  } = product.useUpdate()
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
    reset
  } = useForm({ resolver: yupResolver(productSchema) })

  async function onSubmit(data: FormData) {
    await updateProduct({
      variables: {
        Id: productData?.Id,
        Nome: data.Nome,
        // Descricao: data.Descricao,
        Utilizacao: data.Utilizacao,
        UnidadeDeMedida_Id: data.UnidadeMedida.key,
        NCM: data.NCM
      }
    })
      .then(() => {
        productRefetch()
        setButtonName('Editar')
        router.push(rotas.erp.compras.produtos.index)
        notification(data.Nome + ' editado com sucesso', 'success')
      })
      .catch((err) => {
        showError(err)
      })
  }

  useEffect(() => {
    reset({
      Nome: productData?.Nome || '',
      // Descricao: productData?.Descricao || '',
      Utilizacao: productData?.Utilizacao || '',
      UnidadeMedida: {
        key: productData?.UnidadeDeMedida_Id || '',
        title: productData?.UnidadeDeMedida_Id || ''
      },
      NCM: productData?.NCM || 0
    })
  }, [productData, reset])

  return (
    <common.Card>
      <common.GenericTitle
        className="px-6"
        title="Dados Gerais"
        subtitle="Nome do Produto"
      />
      <common.Separator className="mb-0" />
      <form>
        <form.FormLine position={1} grid={2}>
          <form.Input
            fieldName="Nome"
            title="Nome"
            register={register}
            error={errors.Nome}
            disabled={buttonName === 'Editar'}
          />
          {/* <common.Input
            nomeDoCampo="Descricao"
            titulo="Descrição"
            register={register}
            error={errors.Descricao}
            disabled={buttonName === 'Editar'}
          /> */}
          <form.Input
            fieldName="Utilizacao"
            disabled={buttonName === 'Editar'}
            title="Utilização"
            register={register}
            error={errors.Utilizacao}
          />
        </form.FormLine>

        <form.FormLine position={2} grid={2}>
          <Controller
            control={control}
            name="UnidadeMedida"
            render={({ field: { onChange, value } }) => (
              <div>
                <form.Select
                  itens={
                    unitsOfMeasureData
                      ? unitsOfMeasureData.UnidadesDeMedidas.map((item) => {
                          return {
                            key: item.Valor,
                            title: item.Comentario
                          }
                        })
                      : []
                  }
                  value={value}
                  onChange={onChange}
                  error={errors.Fabricantes}
                  disabled={buttonName === 'Editar'}
                  label="Unidade de medida"
                />
              </div>
            )}
          />
          <form.Input
            fieldName="NCM"
            title="NCM"
            register={register}
            error={errors.NCM}
            type="number"
            disabled={buttonName === 'Editar'}
          />
        </form.FormLine>
      </form>
      <div className="flex items-center justify-between w-full px-6 mt-4">
        <buttons.GoBackButton />
        <div className="flex gap-2">
          {buttonName === 'Atualizar' && (
            <buttons.CancelButton
              onClick={() => {
                setButtonName('Editar')
              }}
            />
          )}
          <buttons.PrimaryButton
            title={buttonName}
            disabled={productLoading || updateProductLoading}
            loading={productLoading || updateProductLoading}
            onClick={() => {
              if (buttonName === 'Editar') {
                setButtonName('Atualizar')
                return
              }
              handleSubmit(onSubmit)()
            }}
          />
        </div>
      </div>
    </common.Card>
  )
}

export default Formulario
