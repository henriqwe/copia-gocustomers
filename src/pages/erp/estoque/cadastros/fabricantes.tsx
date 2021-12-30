import { useSection } from 'hooks/useSection'

import * as manufacturers from '@/domains/erp/inventory/Registration/Manufacturers'

import rotas from '@/domains/routes'
import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'

export default function Manufacturers() {
  const user = useSection()
  if (!user) return null
  return (
    <manufacturers.ManufacturerProvider>
      <Page />
    </manufacturers.ManufacturerProvider>
  )
}

export function Page() {
  const { manufacturersRefetch, manufacturersLoading } =
    manufacturers.useManufacturer()
  return (
    <InternalNavigationAndSlide
      SubMenu={<manufacturers.InternalNavigation />}
      title="Fabricantes de estoque"
      reload={{ action: manufacturersRefetch, state: manufacturersLoading }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Estoque', url: rotas.erp.estoque.index },
        {
          title: 'Fabricantes',
          url: rotas.erp.estoque.cadastros.fabricantes
        }
      ]}
    >
      <manufacturers.List />
      <manufacturers.SlidePanel />
    </InternalNavigationAndSlide>
  )
}
