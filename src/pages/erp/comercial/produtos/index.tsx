import { useSection } from 'hooks/useSection'

import * as products from '@/domains/erp/commercial/Products'

import rotas from '@/domains/routes'
import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'

export default function Products() {
  const user = useSection()
  if (!user) return null
  return (
    <products.ProductProvider>
      <Page />
    </products.ProductProvider>
  )
}

export function Page() {
  const { productsRefetch, productsLoading } = products.useProduct()
  const refetch = () => {
    productsRefetch()
  }
  //const { usuario } = useUsuario()
  return (
    <InternalNavigationAndSlide
      SubMenu={<products.InternalNavigation />}
      title="Produtos"
      reload={{ action: refetch, state: productsLoading }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Comercial', url: rotas.erp.comercial.index },
        {
          title: 'Produtos',
          url: rotas.erp.comercial.produtos
        }
      ]}
    >
      <products.List />
      <products.SlidePanel />
    </InternalNavigationAndSlide>
  )
}
