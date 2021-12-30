import { useSection } from 'hooks/useSection'

import * as propostas from '@/domains/erp/commercial/Proposals'

import rotas from '@/domains/routes'
import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'

export default function Propostas() {
  const user = useSection()
  if (!user) return null
  return (
    <propostas.ListProvider>
      <Page />
    </propostas.ListProvider>
  )
}

export function Page() {
  const { proposalsRefetch, proposalsLoading } = propostas.useList()
  const refetch = () => {
    proposalsRefetch()
  }
  //const { usuario } = useUsuario()
  return (
    <InternalNavigationAndSlide
      SubMenu={<propostas.InternalNavigation />}
      title="Propostas"
      reload={{ action: refetch, state: proposalsLoading }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Comercial', url: rotas.erp.comercial.index },
        {
          title: 'Propostas',
          url: rotas.erp.comercial.propostas.index
        }
      ]}
    >
      <propostas.List />
    </InternalNavigationAndSlide>
  )
}
