import { useSection } from 'hooks/useSection'

import * as flows from '@/domains/erp/services/Registration/Flows'

import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'
import rotas from '@/domains/routes'

export default function Flows() {
  const user = useSection()
  if (!user) return null
  return (
    <flows.FlowProvider>
      <Page />
    </flows.FlowProvider>
  )
}

export function Page() {
  const { flowsRefetch, flowsLoading } = flows.useFlow()
  return (
    <InternalNavigationAndSlide
      SubMenu={<flows.InternalNavigation />}
      title="Fluxos"
      reload={{ action: flowsRefetch, state: flowsLoading }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Atendimento', url: rotas.erp.atendimento.index },
        {
          title: 'Cadastros',
          url: rotas.erp.atendimento.cadastros.index
        },
        {
          title: 'Fluxos',
          url: rotas.erp.atendimento.cadastros.fluxos.index
        }
      ]}
    >
      <flows.List />
      <flows.SlidePanel />
    </InternalNavigationAndSlide>
  )
}
