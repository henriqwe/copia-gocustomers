import { Controller, useForm } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as outgoingOrders from '@/domains/erp/outgoingOrders'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function ReceiveOutgoingOrder() {
  const {
    outgoingOrderProductsRefetch,
    authorizedOutgoingOrderProductsData,
    setSlidePanelState,
    outgoingOrderData,
    outgoingOrderRefetch,
    receiveOutgoingOrder,
    receiveOutgoingOrderLoading,
    setButtonName,
    receiveOutgoingOrderProducts,
    receiveOutgoingOrderProductsLoading,
    outgoingOrderLogsRefetch
  } = outgoingOrders.useUpdate()
  const { handleSubmit, control } = useForm()

  async function receiveOutgoingOrders(formData: any) {
    try {
      authorizedOutgoingOrderProductsData?.map(async (produtos, index) => {
        if (!formData['quantidade' + index]) {
          throw new Error('Informe a quantidade dos produtos')
        }

        await receiveOutgoingOrderProducts({
          variables: {
            Id: produtos.Id,
            QuantidadeRecebida: formData['quantidade' + index]
          }
        })
      })

      await receiveOutgoingOrder({
        variables: {
          Id: outgoingOrderData?.Id
        }
      }).then(() => {
        setButtonName('Recebido')
        outgoingOrderProductsRefetch()
        outgoingOrderRefetch()
        outgoingOrderLogsRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false }
        })
        notification('Pedido recebido com sucesso', 'success')
      })
    } catch (err: any) {
      showError(err)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(receiveOutgoingOrders)}
      data-testid="inserirForm"
      className="flex flex-col items-end"
    >
      <div className="flex flex-col w-full gap-2 mb-2">
        {authorizedOutgoingOrderProductsData?.map((produto, index) => (
          <div key={index}>
            <common.TitleWithSubTitleAtTheTop
              title={produto.Produto.Nome}
              subtitle="Nome do produto"
            />

            <div className="w-full">
              <Controller
                control={control}
                name={'quantidade' + index}
                defaultValue={produto.QuantidadeEntregue}
                render={({ field: { onChange, value } }) => (
                  <div>
                    <form.Input
                      fieldName={'quantidade' + index}
                      title="Quantidade recebida"
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
        title="Receber"
        disabled={
          receiveOutgoingOrderLoading || receiveOutgoingOrderProductsLoading
        }
        loading={
          receiveOutgoingOrderLoading || receiveOutgoingOrderProductsLoading
        }
      />
    </form>
  )
}
