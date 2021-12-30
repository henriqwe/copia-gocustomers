import * as blocks from '@/blocks'
import * as purchaseOrders from '@/domains/erp/purchases/PurchaseOrders'

export default function SlidePanel() {
  const { slidePanelState, setSlidePanelState } =
    purchaseOrders.budgets.useBudget()

  let title = 'Cadastrar orçamento'
  let content = <purchaseOrders.budgets.Create />
  switch (slidePanelState.type) {
    case 'view':
      content = <purchaseOrders.budgets.View />
      title = 'Visualizar orçamento'
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
