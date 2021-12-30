import { Controller, useForm } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as purchaseOrders from '@/domains/erp/purchases/PurchaseOrders'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function AuthorizeBudget() {
  const { setSlidePanelState, slidePanelState, budgetsRefetch } =
    purchaseOrders.budgets.useBudget()
  const {
    purchaseOrderRefetch,
    authorizePurchaseOrderProducts,
    authorizePurchaseOrder,
    authorizePurchaseOrderLoading,
    purchaseOrderData,
    purchaseOrderLogsRefetch,
    purchaseOrderProductsRefetch,
    authorizedPurchaseOrderProductsRefetch
  } = purchaseOrders.useUpdate()
  const { handleSubmit, control, watch } = useForm()
  const authorizeds: boolean[] = []

  const onSubmit = async (formData: any) => {
    try {
      const validation = slidePanelState.data?.Orcamentos_Produtos?.map(
        (item, index) => {
          if (!formData['quantidade' + index]) {
            return null
          }
        }
      )
      if (validation?.includes(null)) {
        throw new Error('Informe a quantidade dos itens')
      }

      slidePanelState.data?.Orcamentos_Produtos?.map(async (item, index) => {
        await authorizePurchaseOrderProducts({
          variables: {
            Id: item.PedidosDeCompra_Produto_Id,
            QuantidadeAutorizada: formData['check' + index]
              ? formData['quantidade' + index]
              : null,
            Autorizado: formData['check' + index]
          }
        })
      })

      await authorizePurchaseOrder({
        variables: {
          Id: purchaseOrderData?.Id,
          Orcamento_Id: slidePanelState.data?.Id
        }
      }).then(() => {
        purchaseOrderProductsRefetch()
        purchaseOrderRefetch()
        purchaseOrderLogsRefetch()
        budgetsRefetch()
        authorizedPurchaseOrderProductsRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false, showModal: false }
        })
        notification('Pedido autorizado com sucesso', 'success')
      })
    } catch (err: any) {
      showError(err)
    }
  }

  slidePanelState.data?.Orcamentos_Produtos?.map((_, index) => {
    authorizeds.push(!watch('check' + index))
  })

  function disableMainButton() {
    return authorizePurchaseOrderLoading || !authorizeds.includes(false)
  }

  return (
    <form data-testid="inserirForm" className="flex flex-col items-end">
      <div className="flex flex-col w-full gap-2 mb-2">
        {slidePanelState.data?.Orcamentos_Produtos.map((produto, index) => (
          <div key={index}>
            <common.TitleWithSubTitleAtTheTop
              title={
                produto.PedidosDeCompra_Produto.Produto.Nome +
                ' - ' +
                produto.Descricao
              }
              subtitle="Nome do produto"
            />

            <div className="flex items-center w-full gap-4">
              <Controller
                control={control}
                name={'quantidade' + index}
                defaultValue={produto.Quantidade}
                render={({
                  field: { onChange, value = produto.Quantidade }
                }) => (
                  <div className="flex-1">
                    <form.Input
                      fieldName={'quantidade' + index}
                      title="Quantidade autorizada"
                      value={value}
                      onChange={onChange}
                      disabled={
                        watch('check' + index) !== undefined
                          ? !watch('check' + index)
                          : true
                      }
                    />
                  </div>
                )}
              />
              <Controller
                control={control}
                name={'check' + index}
                defaultValue={false}
                render={({ field: { onChange, value = false } }) => (
                  <div>
                    <form.Switch
                      value={value}
                      onChange={() => onChange(!value)}
                      alt="autorizar/desautorizar produto"
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
        title="Autorizar"
        disabled={disableMainButton()}
        type="button"
        onClick={() =>
          setSlidePanelState((oldState) => {
            return { ...oldState, showModal: true }
          })
        }
      />

      <common.Modal
        handleSubmit={handleSubmit(onSubmit)}
        open={slidePanelState.showModal}
        disabled={disableMainButton()}
        description="Deseja mesmo autorizar esse pedido de compra?"
        onClose={() =>
          setSlidePanelState((oldState) => {
            return { ...oldState, showModal: false }
          })
        }
        buttonTitle="Confirmar"
        modalTitle="Autorizar pedido de compra?"
      />
    </form>
  )
}
