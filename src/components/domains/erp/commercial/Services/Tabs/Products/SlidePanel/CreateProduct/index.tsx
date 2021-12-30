import { Controller, useForm } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as products from '@/domains/erp/commercial/Services/Tabs/Products'

import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

type FormData = {
  Produto_Id: {
    key: string
    title: string
  }
}

export default function CreateProduct() {
  const {
    createProductLoading,
    createProduct,
    setSlidePanelState,
    productsRefetch,
    productSchema,
    mainProductsData
  } = products.useProduct()
  const {
    handleSubmit,
    formState: { errors },
    control
  } = useForm({
    resolver: yupResolver(productSchema)
  })
  const onSubmit = (formData: FormData) => {
    createProduct({
      variables: {
        Produto_Id: formData.Produto_Id.key
      }
    })
      .then(() => {
        productsRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false }
        })
        notification('Produto cadastrado com sucesso', 'success')
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
        <Controller
          control={control}
          name="Produto_Id"
          render={({ field: { onChange, value } }) => (
            <div>
              <form.Select
                itens={
                  mainProductsData
                    ? mainProductsData.map((item) => {
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
            </div>
          )}
        />
      </div>
      <common.Separator />
      <buttons.PrimaryButton
        title="Enviar"
        disabled={createProductLoading}
        loading={createProductLoading}
      />
    </form>
  )
}
