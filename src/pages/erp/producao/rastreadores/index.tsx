import { useSection } from 'hooks/useSection'

import * as trackers from '@/domains/erp/production/Trackers'

import rotas from '@/domains/routes'
import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'

export default function Trackers() {
  const user = useSection()
  if (!user) return null
  return (
    <trackers.ListProvider>
      <Page />
    </trackers.ListProvider>
  )
}

export function Page() {
  const { trackersRefetch, trackersLoading } = trackers.useList()
  //const { usuario } = useUsuario()
  return (
    <InternalNavigationAndSlide
      SubMenu={<trackers.InternalNavigation />}
      title="Rastreadores de estoque"
      reload={{
        action: trackersRefetch,
        state: trackersLoading
      }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        {
          title: 'Produção',
          url: rotas.erp.producao.identificaveis.chips.index
        },
        {
          title: 'Rastreadores',
          url: rotas.erp.producao.rastreadores.index
        }
      ]}
    >
      <trackers.List />
    </InternalNavigationAndSlide>
  )
}
