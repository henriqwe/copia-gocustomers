import { useSection } from 'hooks/useSection'

import * as questionsGroups from '@/domains/erp/services/Registration/Questions/Groups'
import * as questions from '@/domains/erp/services/Registration/Questions'

import rotas from '@/domains/routes'

import { UserProvider } from 'contexts/UserContext'
import Base from '@/templates/Base'

export default function CreateQuestionsGroup() {
  const usuario = useSection()
  if (!usuario) return null
  return (
    <UserProvider>
      <questionsGroups.CreateProvider>
        <questions.QuestionProvider>
          <Page />
        </questions.QuestionProvider>
      </questionsGroups.CreateProvider>
    </UserProvider>
  )
}

export function Page() {
  const { questionsRefetch, questionsLoading } = questions.useQuestion()
  return (
    <Base
      title="Cadastro de Grupo de Perguntas"
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
        },
        {
          title: 'Cadastro',
          url: rotas.erp.atendimento.cadastros.fluxos.etapas
        }
      ]}
    >
      <questionsGroups.Create />
    </Base>
  )
}
