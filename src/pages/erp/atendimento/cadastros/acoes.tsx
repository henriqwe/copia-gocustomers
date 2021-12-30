import { useSection } from 'hooks/useSection'

import * as action from '@/domains/erp/services/Registration/Actions'
import * as flowStages from '@/domains/erp/services/Registration/Flows/Stage'

import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'
import rotas from '@/domains/routes'

export default function Actions() {
  const user = useSection()
  if (!user) return null
  return (
    <action.ActionProvider>
      <flowStages.StageProvider>
        <Page />
      </flowStages.StageProvider>
    </action.ActionProvider>
  )
}

export function Page() {
  const { stagesRefetch } = flowStages.useStage()
  const { actionsRefetch, actionsLoading } = action.useAction()

  function refetch() {
    stagesRefetch()
    actionsRefetch()
  }
  return (
    <InternalNavigationAndSlide
      SubMenu={<action.InternalNavigation />}
      title="Ações"
      reload={{ action: refetch, state: actionsLoading }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Atendimento', url: rotas.erp.atendimento.index },
        {
          title: 'Cadastros',
          url: rotas.erp.atendimento.cadastros.index
        },
        {
          title: 'Ações',
          url: rotas.erp.atendimento.cadastros.acoes
        }
      ]}
    >
      <action.List />
      <action.SlidePanel />
    </InternalNavigationAndSlide>
  )
}
