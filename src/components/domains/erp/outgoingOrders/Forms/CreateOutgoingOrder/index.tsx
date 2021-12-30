import { useRouter } from 'next/router'
import { useForm, Controller } from 'react-hook-form'

import rotas from '@/domains/routes'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as outgoingOrders from '@/domains/erp/outgoingOrders'
import * as products from '@/domains/erp/purchases/Products'
import * as manufacturers from '@/domains/erp/inventory/Registration/Manufacturers'
import { useEffect, useState } from 'react'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

const CreateOutgoingOrder = () => {
  const [productsGroups, setproductsGroups] = useState<number[]>([1])
  const [lastNumber, setlastNumber] = useState(0)
  const [reload, setReload] = useState(false)
  const router = useRouter()
  const { productsData } = products.useList()
  // const { fabricantesData, setEstadoDoSlideLateral } =
  //   fabricantes.useFabricante()
  const { createOutgoingOrderLoading, createOutgoingOrder } =
    outgoingOrders.useCreate()
  const { register, control, handleSubmit } = useForm()

  async function onSubmit(data: any) {
    const filteredProductsGroups = productsGroups.filter(
      (outgoingOrder) => outgoingOrder !== 0
    )
    try {
      const itensValues = filteredProductsGroups.map((produto) => {
        if (
          !data['produto' + produto] ||
          !data['quantidade' + produto]
          // !data['fabricante' + produto]
        ) {
          return
        }

        return {
          QuantidadePedida: data['quantidade' + produto],
          Produto_Id: data['produto' + produto].key,
          Fabricante_Id: null, //data['fabricante' + produto].key,
          Descricao: data['descricao' + produto] || null
        }
      })

      if (itensValues.includes(undefined)) {
        throw new Error('Preencha todos os campos para continuar')
      }

      await createOutgoingOrder({
        variables: {
          data: itensValues
        }
      }).then((resposta) => {
        router.push(
          rotas.erp.pedidosDeSaida.index +
            '/' +
            resposta?.data.insert_pedidosDeSaida_Pedidos_one.Id
        )
        notification('Pedido criado com sucesso', 'success')
      })
    } catch (err: any) {
      showError(err)
    }
  }

  useEffect(() => {
    if (productsGroups[productsGroups.length - 1] > lastNumber) {
      setlastNumber(productsGroups[productsGroups.length - 1])
    }
  }, [productsGroups])

  return (
    <common.Card>
      <common.GenericTitle
        title="Dados do pedido de saída"
        subtitle="Produtos, quantidade"
        className="px-6"
      />

      <common.Separator />
      <form>
        {productsGroups.map(
          (product, index) =>
            product !== 0 && (
              <form.FormLine position={index} grid={9} key={index}>
                <Controller
                  control={control}
                  name={'produto' + product}
                  render={({ field: { onChange, value } }) => (
                    <div className="col-span-2">
                      <form.Select
                        itens={
                          productsData
                            ? productsData.map((product) => {
                                return {
                                  key: product.Id,
                                  title: product.Nome
                                }
                              })
                            : []
                        }
                        value={value}
                        onChange={onChange}
                        label="Produto"
                      />
                      <common.OpenModalLink
                        onClick={() =>
                          router.push(rotas.erp.compras.produtos.cadastrar)
                        }
                      >
                        Cadastrar produto
                      </common.OpenModalLink>
                    </div>
                  )}
                />
                <div className="col-span-4">
                  <form.Input
                    fieldName={'descricao' + product}
                    title="Descrição"
                    register={register}
                  />
                </div>
                <div className="col-span-2">
                  <form.Input
                    fieldName={'quantidade' + product}
                    title="Quantidade"
                    register={register}
                  />
                </div>
                {/* <Controller
              control={control}
              name={'fabricante' + produto}
              render={({
                field: { onChange, value = { key: '', titulo: 'Fabricante' } }
              }) => (
                <div className="col-span-2">
                  <common.Select
                    items={
                      fabricantesData
                        ? fabricantesData.estoque_Fabricantes.map((produto) => {
                            return {
                              key: produto.Id,
                              titulo: produto.Nome
                            }
                          })
                        : []
                    }
                    value={value}
                    onChange={onChange}
                  />
                  <common.OpenModalLink
                    onClick={() => setEstadoDoSlideLateral(true)}
                  >
                    Cadastrar Fabricante
                  </common.OpenModalLink>
                </div>
              )}
            /> */}
                {product !== 1 && (
                  <buttons.DeleteButton
                    onClick={() => {
                      productsGroups[index] = 0
                      setReload(!reload)
                    }}
                  />
                )}
              </form.FormLine>
            )
        )}

        {!createOutgoingOrderLoading && (
          <common.AddForm
            array={productsGroups}
            setArray={setproductsGroups}
            lastNumber={lastNumber}
          >
            Adicionar outro produto
          </common.AddForm>
        )}
      </form>
      <div className="flex items-center justify-between w-full px-6 mt-4">
        <buttons.GoBackButton />
        <buttons.PrimaryButton
          title="Confirmar pedido"
          disabled={createOutgoingOrderLoading}
          onClick={handleSubmit(onSubmit)}
          loading={createOutgoingOrderLoading}
        />
      </div>
      <manufacturers.SlidePanel />
    </common.Card>
  )
}

export default CreateOutgoingOrder
