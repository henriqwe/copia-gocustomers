import { useSection } from 'hooks/useSection'

import * as outgoingOrders from '@/domains/erp/outgoingOrders'
import * as products from '@/domains/erp/purchases/Products'
import * as manufacturers from '@/domains/erp/inventory/Registration/Manufacturers'

import rotas from '@/domains/routes'

import { UserProvider } from 'contexts/UserContext'
import Base from '@/templates/Base'

export default function CreateOutgoingOrder() {
  const usuario = useSection()
  if (!usuario) return null
  return (
    <UserProvider>
      <outgoingOrders.CreateProvider>
        <products.ListProvider>
          <manufacturers.ManufacturerProvider>
            <Page />
          </manufacturers.ManufacturerProvider>
        </products.ListProvider>
      </outgoingOrders.CreateProvider>
    </UserProvider>
  )
}

export function Page() {
  const { productsRefetch, productsLoading } = products.useList()
  const { manufacturersRefetch } = manufacturers.useManufacturer()

  const refetch = () => {
    manufacturersRefetch()
    productsRefetch()
  }
  return (
    <Base
      title="Cadastro de Pedido de saída"
      reload={{ action: refetch, state: productsLoading }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Compras', url: rotas.erp.compras.index },
        {
          title: 'Pedidos',
          url: rotas.erp.pedidosDeSaida.index
        }
      ]}
    >
      <outgoingOrders.Create />
    </Base>
  )
}
