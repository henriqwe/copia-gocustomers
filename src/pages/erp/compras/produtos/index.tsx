import { useSection } from 'hooks/useSection'

import * as products from '@/domains/erp/purchases/Products'

import rotas from '@/domains/routes'

import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'

export default function Products() {
  const user = useSection()
  if (!user) return null
  return (
    <products.ListProvider>
      <Page />
    </products.ListProvider>
  )
}

export function Page() {
  const { productsRefetch, productsLoading } = products.useList()
  return (
    <InternalNavigationAndSlide
      SubMenu={<products.InternalNavigation />}
      title="Listagem de Produtos"
      reload={{ action: productsRefetch, state: productsLoading }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Pedidos de Compra', url: rotas.erp.compras.index },
        {
          title: 'Produtos',
          url: rotas.erp.compras.produtos.cadastrar
        }
      ]}
    >
      <products.List />
    </InternalNavigationAndSlide>
  )
}
