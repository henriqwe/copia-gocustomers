import { useSection } from 'hooks/useSection'

import * as questionsGroups from '@/domains/erp/services/Registration/Questions/Groups'

import * as questions from '@/domains/erp/services/Registration/Questions'

import rotas from '@/domains/routes'

import Base from '@/templates/Base'

export default function UpdateQuestionsGroup() {
  const user = useSection()
  if (!user) return null
  return (
    <questionsGroups.UpdateProvider>
      <questions.QuestionProvider>
        <Page />
      </questions.QuestionProvider>
    </questionsGroups.UpdateProvider>
  )
}

export function Page() {
  const { questionsRefetch, questionsLoading } = questions.useQuestion()
  return (
    <Base
      title="Edição de Grupo de pergunta"
      reload={{ action: questionsRefetch, state: questionsLoading }}
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
      <questionsGroups.Update />
    </Base>
  )
}
