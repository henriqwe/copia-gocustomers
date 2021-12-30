import { useSection } from 'hooks/useSection'

import * as families from '@/domains/erp/inventory/Registration/Families'

import rotas from '@/domains/routes'
import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'

export default function Families() {
  const user = useSection()
  if (!user) return null
  return (
    <families.FamilyProvider>
      <Page />
    </families.FamilyProvider>
  )
}

export function Page() {
  const { familiesRefetch, familiesLoading, parentsFamiliesRefetch } =
    families.useFamily()
  const refetch = () => {
    familiesRefetch()
    parentsFamiliesRefetch()
  }
  //const { usuario } = useUsuario()
  return (
    <InternalNavigationAndSlide
      SubMenu={<families.InternalNavigation />}
      title="Famílias de estoque"
      reload={{ action: refetch, state: familiesLoading }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Estoque', url: rotas.erp.estoque.index },
        {
          title: 'Famílias',
          url: rotas.erp.estoque.cadastros.familias
        }
      ]}
    >
      <families.List />
      <families.SlidePanel />
    </InternalNavigationAndSlide>
  )
}
