import { useRouter } from 'next/router'
import { useForm, Controller } from 'react-hook-form'

import rotas from '@/domains/routes'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as exits from '@/domains/erp/inventory/Moves/Exits'
import * as purchaseOrders from '@/domains/erp/purchases/PurchaseOrders'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'
import { useEffect } from 'react'

const ValidateOutgoingOrder = () => {
  const router = useRouter()
  const { createPurchaseOrder, createPurchaseOrderLoading } =
    purchaseOrders.useCreate()
  const {
    outgoingOrderProductsData,
    validateOutgoingOrder,
    validateOutgoingOrderLoading,
    deliverOutgoindOrder,
    deliverOutgoindOrderLoading,
    GetItemByProductId,
    getItemAmount
  } = exits.useValidate()
  const { control, handleSubmit, watch, setValue } = useForm()

  const itensArray = [] as any[]

  const onSubmit = async (data: any) => {
    try {
      const valition = outgoingOrderProductsData?.map((produto, index) => {
        if (!data['quantidade' + index] || data['quantidade' + index] < 1) {
          return null
        }

        return data['item' + index]
      })

      if (valition?.includes(null)) {
        throw new Error('Digite a quantidade para continuar')
      }

      outgoingOrderProductsData?.map(async (produto, index) => {
        if (
          data['item' + index] !== undefined &&
          produto.QuantidadeEntregue === null
        ) {
          await validateOutgoingOrder({
            variables: {
              Quantidade: data['quantidade' + index],
              Item_Id: data['item' + index].key,
              Id: produto.Id
            }
          })
        }
      })
      await deliverOutgoindOrder({
        variables: {
          Situacao: valition?.includes(undefined)
            ? 'entradaParcial'
            : 'entregue'
        }
      }).then(() => {
        notification(
          'Saida de itens no estoque realizado com sucesso',
          'success'
        )
        router.push(rotas.erp.estoque.movimentacoes.saidas.index)
      })
    } catch (error: any) {
      showError(error)
    }
  }

  const CreatePurchaseOrder = async (data: any) => {
    try {
      const itemPosition: number[] = []
      const valition = outgoingOrderProductsData?.map((produto, index) => {
        if (
          data['item' + index] === undefined ||
          data['saldoDoItem' + index] === 0
        ) {
          itemPosition.push(index)
        }
        if (!data['quantidade' + index]) {
          return null
        }
      })

      if (valition?.includes(null)) {
        throw new Error('Digite a quantidade para continuar')
      }

      const dadosParaCriacaoDePedidoDeCompra = itemPosition?.map((posicao) => {
        return {
          QuantidadePedida: data['quantidade' + posicao],
          Produto_Id: data['produto' + posicao].key,
          // Fabricante_Id: data['fabricante' + posicao].key,
          Descricao: data['descricao' + posicao]
        }
      })

      await createPurchaseOrder({
        variables: {
          data: dadosParaCriacaoDePedidoDeCompra
        }
      }).then((resposta) => {
        router.push(
          rotas.erp.compras.pedidos.index +
            '/' +
            resposta?.data.insert_pedidosDeCompra_Pedidos_one.Id
        )
        notification('Pedido de compra criado com sucesso', 'success')
      })
    } catch (err: any) {
      notification(err.message, 'error')
    }
  }

  outgoingOrderProductsData?.map((produto, index) => {
    if (produto.QuantidadeEntregue === null) {
      itensArray.push(watch('item' + index), watch('saldoDoItem' + index))
    }
  })

  function disableMainButton() {
    const itensComValores = itensArray.filter((item) => {
      return item !== undefined
    })

    const arrayItens: any[] = []
    outgoingOrderProductsData?.map((item, index) => {
      if (watch('quantidade' + index) > watch('saldoDoItem' + index)) {
        arrayItens.push(null)
      }
    })

    if (arrayItens.includes(null)) {
      return true
    }

    return (
      validateOutgoingOrderLoading ||
      deliverOutgoindOrderLoading ||
      itensComValores.length === 0
    )
  }

  useEffect(() => {
    LoadItens()
  }, [outgoingOrderProductsData])

  function LoadItens() {
    outgoingOrderProductsData?.map(async (produto, index) => {
      const itens = await GetItemByProductId(produto.Produto.Id)
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
        title="Dados do pedido de saída"
        subtitle="Nome dos produtos, quantidade entregada"
        className="px-6"
      />

      <common.Separator />
      <form onSubmit={handleSubmit(onSubmit)}>
        {outgoingOrderProductsData?.map((produto, index) => (
          <form.FormLine position={index} grid={5} key={index}>
            <h2 className="col-span-5">
              {produto.Produto.Nome}
              {' - '}
              {produto.Produto.UnidadeDeMedida_Id}
              {' - '}
              <span className="font-bold">{produto.Descricao}</span>
            </h2>
            <div className="hidden">
              <Controller
                control={control}
                defaultValue={{
                  key: produto.Produto.Id,
                  title: produto.Produto.Nome
                }}
                name={'produto' + index}
                render={({ field: { onChange, value } }) => (
                  <div>
                    <form.Select
                      itens={[]}
                      value={value}
                      onChange={onChange}
                      disabled={true}
                      label="Produto"
                    />
                  </div>
                )}
              />
            </div>
            <div className="hidden">
              <Controller
                control={control}
                name={'descricao' + index}
                defaultValue={produto.Descricao}
                render={({ field: { value } }) => (
                  <div className="flex-1">
                    <form.Input
                      fieldName={'descricao' + index}
                      title="Descrição"
                      value={value}
                      onChange={() => null}
                      disabled={true}
                    />
                  </div>
                )}
              />
            </div>
            <div className="hidden">
              <form.Input
                fieldName={'UnidadeDeMedida_Id' + index}
                title="Unidade de medida"
                value={produto.Produto.UnidadeDeMedida_Id}
                onChange={() => null}
                disabled={true}
              />
            </div>
            {/* <div>
              <Controller
                control={control}
                defaultValue={{
                  key: produto.Fabricante.Id,
                  titulo: produto.Fabricante.Nome
                }}
                name={'fabricante' + index}
                render={({ field: { onChange, value } }) => (
                  <div>
                    <common.Select
                      items={[]}
                      value={value}
                      onChange={onChange}
                      disabled={true}
                    />
                  </div>
                )}
              />
            </div> */}

            <Controller
              control={control}
              name={'item' + index}
              defaultValue={
                produto.QuantidadeEntregue !== null
                  ? {
                      key: produto.Produto.Id,
                      titulo: produto.Produto.Nome
                    }
                  : undefined
              }
              render={({ field: { onChange, value } }) => (
                <div className="col-span-2">
                  <form.Select
                    itens={watch('itens' + index) ? watch('itens' + index) : []}
                    value={value}
                    onChange={async (value) => {
                      await getItemAmount(value.key).then((quantidade) => {
                        setValue('saldoDoItem' + index, quantidade)
                        onChange(value)
                      })
                    }}
                    disabled={produto.QuantidadeEntregue !== null}
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
            <Controller
              control={control}
              name={'saldoDoItem' + index}
              render={({ field: { onChange, value } }) => (
                <div className="flex-1">
                  <form.Input
                    fieldName={'saldoDoItem' + index}
                    title="Saldo do item"
                    value={value}
                    onChange={onChange}
                    disabled={true}
                  />
                </div>
              )}
            />

            <Controller
              control={control}
              name={'quantidade' + index}
              defaultValue={
                produto.QuantidadeEntregue !== null
                  ? produto.QuantidadeEntregue
                  : produto.QuantidadeAutorizada
              }
              render={({ field: { onChange, value } }) => (
                <div className="flex-1">
                  <form.Input
                    fieldName={'quantidade' + index}
                    title="Quantidade entregue"
                    value={value}
                    onChange={onChange}
                    disabled={produto.QuantidadeEntregue !== null}
                  />
                </div>
              )}
            />
            <div>
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
            </div>
          </form.FormLine>
        ))}
        <div className="flex items-center justify-between w-full px-6 mt-4">
          <buttons.GoBackButton />
          <div className="flex gap-4">
            {(itensArray.includes(undefined) || itensArray.includes(0)) && (
              <buttons.SecondaryButton
                handler={handleSubmit(CreatePurchaseOrder)}
                title="Criar pedido de compra"
                disabled={createPurchaseOrderLoading}
                loading={createPurchaseOrderLoading}
              />
            )}
            <buttons.PrimaryButton
              title="Registrar saída de itens"
              disabled={disableMainButton()}
              loading={
                validateOutgoingOrderLoading || deliverOutgoindOrderLoading
              }
            />
          </div>
        </div>
      </form>
    </common.Card>
  )
}

export default ValidateOutgoingOrder
