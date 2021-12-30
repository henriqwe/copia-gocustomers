import { useSection } from 'hooks/useSection'

import * as purchaseOrders from '@/domains/erp/purchases/PurchaseOrders'

import rotas from '@/domains/routes'

import { UserProvider } from 'contexts/UserContext'
import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'

export default function PurchaseOrders() {
  const user = useSection()
  if (!user) return null
  return (
    <UserProvider>
      <purchaseOrders.ListProvider>
        <Page />
      </purchaseOrders.ListProvider>
    </UserProvider>
  )
}

export function Page() {
  const { purchaseOrderRefetch, purchaseOrderLoading } =
    purchaseOrders.useList()
  return (
    <InternalNavigationAndSlide
      SubMenu={<purchaseOrders.InternalNavigation />}
      title="Listagem de Pedidos de compra"
      reload={{
        action: purchaseOrderRefetch,
        state: purchaseOrderLoading
      }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Pedidos de Compra', url: rotas.erp.compras.index },
        {
          title: 'Pedidos',
          url: rotas.erp.compras.pedidos.index
        }
      ]}
    >
      <purchaseOrders.List />
    </InternalNavigationAndSlide>
  )
}
