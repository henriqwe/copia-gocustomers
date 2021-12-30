import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as purchaseOrders from '@/domains/erp/purchases/PurchaseOrders'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function BuyPurchaseOrder() {
  const {
    purchaseOrderRefetch,
    buyPurchaseOrder,
    buyPurchaseOrderLoading,
    buyPurchaseOrderProducts,
    slidePanelState,
    setSlidePanelState,
    purchaseOrderData,
    authorizedPurchaseOrderProductsData,
    authorizedPurchaseOrderProductsRefetch,
    purchaseOrderProductsRefetch,
    buySchema,
    purchaseOrderLogsRefetch
  } = purchaseOrders.useUpdate()
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(buySchema)
  })

  const onSubmit = async (formData: any) => {
    try {
      const validation = authorizedPurchaseOrderProductsData?.map(
        (item, index) => {
          if (!formData['quantidade' + index]) {
            return null
          }
        }
      )
      if (validation?.includes(null)) {
        throw new Error('Informe a quantidade dos itens')
      }
      authorizedPurchaseOrderProductsData?.map(async (item, index) => {
        await buyPurchaseOrderProducts({
          variables: {
            Id: item.Id,
            QuantidadeComprada: formData['quantidade' + index]
          }
        })
      })

      await buyPurchaseOrder({
        variables: {
          Id: purchaseOrderData?.Id,
          TipoPagamento: formData.TipoPagamento.key
        }
      }).then(() => {
        purchaseOrderProductsRefetch()
        authorizedPurchaseOrderProductsRefetch()
        purchaseOrderRefetch()
        purchaseOrderLogsRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, showModal: false, open: false }
        })
        notification('Compra do pedido informado com sucesso', 'success')
      })
    } catch (err: any) {
      showError(err)
    }
  }

  return (
    <form data-testid="inserirForm" className="flex flex-col items-end">
      <div className="flex flex-col w-full gap-2 mb-2">
        {authorizedPurchaseOrderProductsData?.map((produto, index) => (
          <div key={index}>
            <common.TitleWithSubTitleAtTheTop
              title={produto.Produto.Nome + ' - ' + produto.Descricao}
              subtitle="Nome do produto"
            />

            <div className="grid w-full grid-cols-1 gap-3">
              <Controller
                control={control}
                name={'quantidade' + index}
                defaultValue={produto.QuantidadeAutorizada}
                render={({
                  field: { onChange, value = produto.QuantidadeAutorizada }
                }) => (
                  <div>
                    <form.Input
                      fieldName={'quantidade' + index}
                      title="Quantidade comprada"
                      value={value}
                      onChange={onChange}
                    />
                  </div>
                )}
              />
            </div>
          </div>
        ))}
      </div>

      <common.Separator />

      <buttons.PrimaryButton
        title="Informar compra"
        disabled={buyPurchaseOrderLoading}
        loading={buyPurchaseOrderLoading}
        type="button"
        onClick={() =>
          setSlidePanelState((oldState) => {
            return { ...oldState, showModal: true }
          })
        }
      />

      <common.Modal
        handleSubmit={handleSubmit(onSubmit)}
        open={slidePanelState.showModal && slidePanelState.type === 'buy'}
        disabled={buyPurchaseOrderLoading}
        description="Deseja mesmo informar a compra desse pedido?"
        onClose={() =>
          setSlidePanelState((oldState) => {
            return { ...oldState, showModal: false }
          })
        }
        buttonTitle="Confirmar"
        modalTitle="Informar compra do pedido?"
      >
        <div className="my-2">
          <Controller
            control={control}
            name="TipoPagamento"
            render={({ field: { onChange, value } }) => (
              <div>
                <form.Select
                  itens={[
                    {
                      key: 'boleto',
                      title: 'Boleto'
                    },
                    {
                      key: 'cartao',
                      title: 'Cartão'
                    }
                  ]}
                  value={value}
                  onChange={onChange}
                  error={errors.TipoPagamento}
                  label="Tipo de pagamento"
                />
              </div>
            )}
          />
        </div>
      </common.Modal>
    </form>
  )
}
