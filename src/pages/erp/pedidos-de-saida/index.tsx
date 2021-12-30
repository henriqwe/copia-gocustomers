import { useSection } from 'hooks/useSection'

import * as outgoingOrders from '@/domains/erp/outgoingOrders'

import rotas from '@/domains/routes'

import { UserProvider } from 'contexts/UserContext'
import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'

export default function OutgoingOrders() {
  const user = useSection()
  if (!user) return null
  return (
    <UserProvider>
      <outgoingOrders.ListProvider>
        <Page />
      </outgoingOrders.ListProvider>
    </UserProvider>
  )
}

export function Page() {
  const { outGoingOrdersRefetch, outGoingOrdersLoading } =
    outgoingOrders.useList()
  return (
    <InternalNavigationAndSlide
      SubMenu={<outgoingOrders.InternalNavigation />}
      title="Listagem de Pedidos de saída"
      reload={{
        action: outGoingOrdersRefetch,
        state: outGoingOrdersLoading
      }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Compras', url: rotas.erp.compras.index },
        {
          title: 'Pedidos',
          url: rotas.erp.pedidosDeSaida.index
        }
      ]}
    >
      <outgoingOrders.List />
    </InternalNavigationAndSlide>
  )
}
