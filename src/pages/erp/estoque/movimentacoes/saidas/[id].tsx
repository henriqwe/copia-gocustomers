import { useSection } from 'hooks/useSection'

import * as itens from '@/domains/erp/inventory/Itens'
import * as exits from '@/domains/erp/inventory/Moves/Exits'
import * as purchaseOrders from '@/domains/erp/purchases/PurchaseOrders'

import rotas from '@/domains/routes'

import Base from '@/templates/Base'

export default function ValidateOutgoingOrder() {
  const usuario = useSection()
  if (!usuario) return null
  return (
    <exits.ValidateProvider>
      <itens.ListProvider>
        <purchaseOrders.CreateProvider>
          <Page />
        </purchaseOrders.CreateProvider>
      </itens.ListProvider>
    </exits.ValidateProvider>
  )
}

export function Page() {
  const { outgoingOrdersRefetch, outgoingOrdersLoading } = exits.useValidate()
  const { itensRefetch } = itens.useList()
  const { purchaseOrderRefetch } = purchaseOrders.useList()

  const refetch = () => {
    itensRefetch()
    purchaseOrderRefetch()
    outgoingOrdersRefetch()
  }
  return (
    <Base
      reload={{
        action: refetch,
        state: outgoingOrdersLoading
      }}
      title="Saida de pedidos de saida"
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Compras', url: rotas.erp.compras.index },
        {
          title: 'Movimentações',
          url: rotas.erp.estoque.movimentacoes.index
        },
        { title: 'Saídas', url: rotas.erp.estoque.movimentacoes.saidas.index }
      ]}
    >
      <exits.Validate />
    </Base>
  )
}
