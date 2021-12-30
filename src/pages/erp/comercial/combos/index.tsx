import { useSection } from 'hooks/useSection'

import * as combos from '@/domains/erp/commercial/Combos'

import rotas from '@/domains/routes'
import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'

export default function Combos() {
  const user = useSection()
  if (!user) return null
  return (
    <combos.ListProvider>
      <Page />
    </combos.ListProvider>
  )
}

export function Page() {
  const { combosRefetch, combosLoading } = combos.useList()
  const refetch = () => {
    combosRefetch()
  }
  //const { usuario } = useUsuario()
  return (
    <InternalNavigationAndSlide
      SubMenu={<combos.InternalNavigation />}
      title="Combos"
      reload={{ action: refetch, state: combosLoading }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Comercial', url: rotas.erp.comercial.index },
        {
          title: 'Combos',
          url: rotas.erp.comercial.combos.index
        }
      ]}
    >
      <combos.List />
    </InternalNavigationAndSlide>
  )
}
