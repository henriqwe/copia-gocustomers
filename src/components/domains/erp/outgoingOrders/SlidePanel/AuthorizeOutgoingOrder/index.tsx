import { Controller, useForm } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as outgoingOrders from '@/domains/erp/outgoingOrders'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function AuthorizeOutgoingOrder() {
  const {
    outgoingOrderProductsRefetch,
    outgoingOrderProductsData,
    setSlidePanelState,
    outgoingOrderData,
    outgoingOrderRefetch,
    authorizeOutgoingOrder,
    authorizeOutgoingOrderLoading,
    setButtonName,
    authorizeOutgoingOrderProducts,
    authorizeOutgoingOrderProductsLoading,
    outgoingOrderLogsRefetch
  } = outgoingOrders.useUpdate()
  const { handleSubmit, control, watch } = useForm()
  const autorizados: boolean[] = []

  async function authorizeOutgoingOrders(formData: any) {
    try {
      outgoingOrderProductsData?.map(async (produto, index) => {
        if (!formData['quantidade' + index]) {
          throw new Error('Informe a quantidade dos produtos')
        }

        await authorizeOutgoingOrderProducts({
          variables: {
            Id: produto.Id,
            QuantidadeAutorizada: formData['check' + index]
              ? formData['quantidade' + index]
              : null,
            Autorizado: formData['check' + index]
          }
        })
      })

      await authorizeOutgoingOrder({
        variables: {
          Id: outgoingOrderData?.Id
        }
      }).then(() => {
        setButtonName('Receber')
        outgoingOrderProductsRefetch()
        outgoingOrderRefetch()
        outgoingOrderLogsRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false }
        })
        notification('Pedido autorizado com sucesso', 'success')
      })
    } catch (err: any) {
      showError(err)
    }
  }

  outgoingOrderProductsData?.map((_, index) => {
    autorizados.push(!watch('check' + index))
  })

  function disableMainButton() {
    return (
      authorizeOutgoingOrderLoading ||
      authorizeOutgoingOrderProductsLoading ||
      !autorizados.includes(false)
    )
  }

  return (
    <form
      onSubmit={handleSubmit(authorizeOutgoingOrders)}
      data-testid="inserirForm"
      className="flex flex-col items-end"
    >
      <div className="flex flex-col w-full gap-2 mb-2">
        {outgoingOrderProductsData?.map((produto, index) => (
          <div key={index}>
            <common.TitleWithSubTitleAtTheTop
              title={produto.Produto.Nome}
              subtitle="Nome do produto"
            />

            <div className="flex items-center w-full gap-4">
              <Controller
                control={control}
                name={'quantidade' + index}
                defaultValue={produto.QuantidadePedida}
                render={({
                  field: { onChange, value = produto.QuantidadePedida }
                }) => (
                  <div className="flex-1">
                    <form.Input
                      fieldName={'quantidade' + index}
                      title="Quantidade"
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
        loading={
          authorizeOutgoingOrderLoading || authorizeOutgoingOrderProductsLoading
        }
      />
    </form>
  )
}
