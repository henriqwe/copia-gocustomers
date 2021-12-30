import { useSection } from 'hooks/useSection'

import * as plans from '@/domains/erp/commercial/Plans'

import rotas from '@/domains/routes'
import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'

export default function Plans() {
  const user = useSection()
  if (!user) return null
  return (
    <plans.ListProvider>
      <Page />
    </plans.ListProvider>
  )
}

export function Page() {
  const { plansRefetch, plansLoading } = plans.useList()
  const refetch = () => {
    plansRefetch()
  }
  //const { usuario } = useUsuario()
  return (
    <InternalNavigationAndSlide
      SubMenu={<plans.InternalNavigation />}
      title="Planos"
      reload={{ action: refetch, state: plansLoading }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Comercial', url: rotas.erp.comercial.index },
        {
          title: 'Planos',
          url: rotas.erp.comercial.planos.index
        }
      ]}
    >
      <plans.List />
    </InternalNavigationAndSlide>
  )
}
