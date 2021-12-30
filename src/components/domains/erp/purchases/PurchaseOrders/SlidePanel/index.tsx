import * as blocks from '@/blocks'
import * as purchaseOrders from '@/domains/erp/purchases/PurchaseOrders'

export default function SlidePanel() {
  const { slidePanelState, setSlidePanelState } = purchaseOrders.useUpdate()

  let title = 'Informar compra do pedido'
  let content = <purchaseOrders.Buy />
  switch (slidePanelState.type) {
    case 'deliver':
      content = <purchaseOrders.Deliver />
      title = 'Registrar recebimento do pedido'
      break

    case 'authorize':
      content = <purchaseOrders.budgets.Authorize />
      title = 'Autorizar pedido de compra'
      break
  }

  return (
    <blocks.Modal
      title={title}
      open={slidePanelState.open}
      handler={setSlidePanelState}
      formContent={content}
    />
  )
}
