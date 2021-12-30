import { Controller, useForm } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as purchaseOrders from '@/domains/erp/purchases/PurchaseOrders'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function DeliverPurchaseOrder() {
  const {
    purchaseOrderProductsRefetch,
    purchaseOrderRefetch,
    setSlidePanelState,
    slidePanelState,
    deliverPurchaseOrderProducts,
    deliverPurchaseOrder,
    deliverPurchaseOrderLoading,
    purchaseOrderData,
    authorizedPurchaseOrderProductsData,
    authorizedPurchaseOrderProductsRefetch,
    purchaseOrderLogsRefetch
  } = purchaseOrders.useUpdate()
  const { handleSubmit, control } = useForm()

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
        await deliverPurchaseOrderProducts({
          variables: {
            Id: item.Id,
            QuantidadeEntregue: formData['quantidade' + index]
          }
        })
      })

      await deliverPurchaseOrder({
        variables: {
          Id: purchaseOrderData?.Id
        }
      }).then(() => {
        purchaseOrderProductsRefetch()
        authorizedPurchaseOrderProductsRefetch()
        purchaseOrderRefetch()
        purchaseOrderLogsRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false, showModal: false }
        })
        notification('Recebimento do pedido registrado com sucesso', 'success')
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
                defaultValue={produto.QuantidadeComprada}
                render={({
                  field: { onChange, value = produto.QuantidadeComprada }
                }) => (
                  <div>
                    <form.Input
                      fieldName={'quantidade' + index}
                      title="Quantidade para entrega"
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
        title="Registrar recebimento"
        disabled={deliverPurchaseOrderLoading}
        loading={deliverPurchaseOrderLoading}
        type="button"
        onClick={() =>
          setSlidePanelState((oldState) => {
            return { ...oldState, showModal: true }
          })
        }
      />

      <common.Modal
        handleSubmit={handleSubmit(onSubmit)}
        open={slidePanelState.showModal && slidePanelState.type === 'deliver'}
        disabled={deliverPurchaseOrderLoading}
        description="Deseja mesmo registrar a recebimento desse pedido?"
        onClose={() =>
          setSlidePanelState((oldState) => {
            return { ...oldState, showModal: false }
          })
        }
        buttonTitle="Confirmar"
        modalTitle="Registrar recebimento do pedido?"
      />
    </form>
  )
}
