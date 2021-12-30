import { useSection } from 'hooks/useSection'

import * as models from '@/domains/erp/inventory/Registration/Models'
import * as manufacturers from '@/domains/erp/inventory/Registration/Manufacturers'
import * as products from '@/domains/erp/purchases/Products'

import rotas from '@/domains/routes'
import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'

export default function Models() {
  const usuario = useSection()
  if (!usuario) return null
  return (
    <models.ModelProvider>
      <manufacturers.ManufacturerProvider>
        <products.ListProvider>
          <Page />
        </products.ListProvider>
      </manufacturers.ManufacturerProvider>
    </models.ModelProvider>
  )
}

export function Page() {
  const { modelsRefetch, modelsLoading } = models.useModel()
  const { manufacturersRefetch } = manufacturers.useManufacturer()
  const { productsRefetch } = products.useList()

  const refetch = () => {
    manufacturersRefetch()
    productsRefetch()
    modelsRefetch()
  }
  return (
    <InternalNavigationAndSlide
      SubMenu={<models.InternalNavigation />}
      title="Modelos de estoque"
      reload={{ action: refetch, state: modelsLoading }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Estoque', url: rotas.erp.estoque.index },
        {
          title: 'Modelos',
          url: rotas.erp.estoque.cadastros.fabricantes
        }
      ]}
    >
      <models.List />
      <models.SlidePanel />
    </InternalNavigationAndSlide>
  )
}
