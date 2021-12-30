import { useSection } from 'hooks/useSection'

import * as outgoingOrders from '@/domains/erp/outgoingOrders'
import * as providers from '@/domains/erp/identities/Providers'

import rotas from '@/domains/routes'

import { UserProvider } from 'contexts/UserContext'
import FormAndTabs from '@/templates/FormAndTabs'

export default function OutgoingOrderDetails() {
  const user = useSection()
  if (!user) return null
  return (
    <UserProvider>
      <outgoingOrders.UpdateProvider>
        <providers.ListProvider>
          <Page />
        </providers.ListProvider>
      </outgoingOrders.UpdateProvider>
    </UserProvider>
  )
}

export function Page() {
  const {
    outgoingOrderLoading,
    outgoingOrderRefetch,
    outgoingOrderLogsRefetch,
    outgoingOrderProductsRefetch,
    outgoingOrderData
  } = outgoingOrders.useUpdate()
  const { providersRefetch } = providers.useList()
  const refetch = () => {
    providersRefetch()
    outgoingOrderRefetch()
    outgoingOrderLogsRefetch()
    outgoingOrderProductsRefetch()
  }
  return (
    <FormAndTabs
      Form={<outgoingOrders.Update />}
      title={`${outgoingOrderData?.Id}`}
      reload={{
        action: refetch,
        state: outgoingOrderLoading
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
      <outgoingOrders.Tabs />
      <outgoingOrders.SlidePanel />
    </FormAndTabs>
  )
}
