import { useRouter } from 'next/router'
import { useForm, Controller } from 'react-hook-form'

import rotas from '@/domains/routes'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as entries from '@/domains/erp/inventory/Moves/Entries'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'
import { useEffect } from 'react'

const Validate = () => {
  const router = useRouter()
  const {
    authorizedPurchaseOrderProductsData,
    validatePurchaseOrder,
    validatePurchaseOrderLoading,
    finalizePurchaseOrder,
    finalizePurchaseOrderLoading,
    getItemById
  } = entries.useValidate()
  const { control, handleSubmit, setValue, watch } = useForm()

  const onSubmit = async (data: any) => {
    try {
      const validations = authorizedPurchaseOrderProductsData?.map(
        (_, index) => {
          if (!data['item' + index]) {
            return null
          }
        }
      )

      if (validations?.includes(null)) {
        throw new Error('Selecione os itens para continuar')
      }
      authorizedPurchaseOrderProductsData?.map(async (product, index) => {
        await validatePurchaseOrder({
          variables: {
            Quantidade: product.QuantidadeEntregue,
            Item_Id: data['item' + index].key
          }
        })
      })
      await finalizePurchaseOrder().then(() => {
        notification(
          'Entrada de itens no estoque realizado com sucesso',
          'success'
        )
        router.push(rotas.erp.estoque.movimentacoes.entradas.index)
      })
    } catch (error: any) {
      showError(error)
    }
  }

  useEffect(() => {
    LoadItens()
  }, [authorizedPurchaseOrderProductsData])

  function LoadItens() {
    authorizedPurchaseOrderProductsData?.map(async (produto, index) => {
      const itens = await getItemById(produto.Produto.Id)
      setValue(
        'itens' + index,
        itens.map((item) => {
          return {
            key: item.Id,
            title:
              item.Produto.Nome +
              ' - ' +
              item.Fabricante.Nome +
              ' - ' +
              item.Modelo?.Nome +
              ' - ' +
              item.Grupo.Nome +
              ' - ' +
              item.Familia.Nome
          }
        })
      )
    })
  }

  return (
    <common.Card>
      <common.GenericTitle
        title="Dados do pedido de compra"
        subtitle="Nome dos produtos, quantidade entregada"
        className="px-6"
      />

      <common.Separator />
      <form onSubmit={handleSubmit(onSubmit)}>
        <form.FormLine position={1} grid={1}>
          <div className="flex items-center gap-4">
            <p>Informe o número da nota fiscal: </p>
            <Controller
              control={control}
              name={'numeroNotaFiscal'}
              render={({ field: { value } }) => (
                <div className="flex-1">
                  <form.Input
                    fieldName={'numeroNotaFiscal'}
                    title="Número da nota fiscal"
                    value={value}
                    onChange={() => null}
                  />
                </div>
              )}
            />
          </div>
        </form.FormLine>
        {authorizedPurchaseOrderProductsData?.map((product, index) => (
          <form.FormLine position={index} grid={4} key={index}>
            <h2 className="col-span-4">
              {product.Produto.Nome}
              {' - '}
              {product.Produto.UnidadeDeMedida_Id}
              {' - '}
              <span className="font-bold">{product.Descricao}</span>
            </h2>

            <Controller
              control={control}
              name={'item' + index}
              render={({ field: { onChange, value } }) => (
                <div className="col-span-2">
                  <form.Select
                    itens={watch('itens' + index) ? watch('itens' + index) : []}
                    value={value}
                    onChange={onChange}
                    label="Item"
                  />
                  <common.OpenModalLink
                    onClick={() =>
                      router.push(rotas.erp.estoque.itens.cadastrar)
                    }
                  >
                    Cadastrar Item
                  </common.OpenModalLink>
                </div>
              )}
            />
            <div>
              <form.Input
                fieldName={'quantidade' + index}
                title="Quantidade entregue"
                value={product.QuantidadeEntregue}
                onChange={() => null}
                disabled={true}
              />
            </div>
            <Controller
              control={control}
              name={'lote' + index}
              render={({ field: { onChange, value } }) => (
                <div className="flex-1">
                  <form.Input
                    fieldName={'lote' + index}
                    title="Lote"
                    value={value}
                    onChange={onChange}
                  />
                </div>
              )}
            />
          </form.FormLine>
        ))}
        <div className="flex items-center justify-between w-full px-6 mt-4">
          <buttons.GoBackButton />
          <buttons.PrimaryButton
            title="Validar pedido"
            disabled={
              validatePurchaseOrderLoading || finalizePurchaseOrderLoading
            }
            loading={
              validatePurchaseOrderLoading || finalizePurchaseOrderLoading
            }
          />
        </div>
      </form>
    </common.Card>
  )
}

export default Validate
