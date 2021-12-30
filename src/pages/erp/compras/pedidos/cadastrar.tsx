import { useSection } from 'hooks/useSection'

import * as purchaseOrders from '@/domains/erp/purchases/PurchaseOrders'
import * as products from '@/domains/erp/purchases/Products'
import * as manufacturers from '@/domains/erp/inventory/Registration/Manufacturers'

import rotas from '@/domains/routes'

import { UserProvider } from 'contexts/UserContext'
import Base from '@/templates/Base'

export default function CreatePurchaseOrder() {
  const user = useSection()
  if (!user) return null
  return (
    <UserProvider>
      <purchaseOrders.CreateProvider>
        <products.ListProvider>
          <manufacturers.ManufacturerProvider>
            <Page />
          </manufacturers.ManufacturerProvider>
        </products.ListProvider>
      </purchaseOrders.CreateProvider>
    </UserProvider>
  )
}

export function Page() {
  const { productsRefetch, productsLoading } = products.useList()
  const { manufacturersRefetch } = manufacturers.useManufacturer()

  const refetch = () => {
    productsRefetch()
    manufacturersRefetch()
  }
  return (
    <Base
      title="Cadastro de Pedido de compras"
      reload={{ action: refetch, state: productsLoading }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Pedidos de Compra', url: rotas.erp.compras.index },
        {
          title: 'Pedidos',
          url: rotas.erp.compras.pedidos.index
        },
        {
          title: 'Cadastro',
          url: rotas.erp.compras.pedidos.cadastrar
        }
      ]}
    >
      <purchaseOrders.Create />
    </Base>
  )
}
