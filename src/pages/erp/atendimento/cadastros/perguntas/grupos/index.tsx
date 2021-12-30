import { useSection } from 'hooks/useSection'

import * as questionsGroups from '@/domains/erp/services/Registration/Questions/Groups'

import rotas from '@/domains/routes'
import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'

export default function QuestionsGroups() {
  const user = useSection()
  if (!user) return null
  return (
    <questionsGroups.ListProvider>
      <Page />
    </questionsGroups.ListProvider>
  )
}

export function Page() {
  const { questionsGroupsRefetch, questionsGroupsLoading } =
    questionsGroups.useList()
  //const { usuario } = useUsuario()
  return (
    <InternalNavigationAndSlide
      SubMenu={<questionsGroups.InternalNavigation />}
      title="Grupos de Perguntas"
      reload={{
        action: questionsGroupsRefetch,
        state: questionsGroupsLoading
      }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Atendimento', url: rotas.erp.atendimento.index },
        {
          title: 'Cadastros',
          url: rotas.erp.atendimento.cadastros.index
        },
        {
          title: 'Perguntas',
          url: rotas.erp.atendimento.cadastros.fluxos.index
        },
        {
          title: 'Grupos',
          url: rotas.erp.atendimento.cadastros.fluxos.etapas
        }
      ]}
    >
      <questionsGroups.List />
    </InternalNavigationAndSlide>
  )
}
