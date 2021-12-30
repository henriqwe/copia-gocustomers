import { useSection } from 'hooks/useSection'

import * as collaborator from '@/domains/erp/identities/Collaborators'

import rotas from '@/domains/routes'
import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'

export default function Collaborator() {
  const user = useSection()
  if (!user) return null
  return (
    <collaborator.CollaboratorProvider>
      <Page />
    </collaborator.CollaboratorProvider>
  )
}

export function Page() {
  const { collaboratorsRefetch, collaboratorsLoading } =
    collaborator.useCollaborator()
  const refetch = () => {
    collaboratorsRefetch()
  }

  return (
    <InternalNavigationAndSlide
      SubMenu={<collaborator.InternalNavigation />}
      title="Colaboradores"
      reload={{ action: refetch, state: collaboratorsLoading }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Identidades', url: rotas.erp.identidades.index },
        { title: 'Colaboradores', url: rotas.erp.identidades.colaboradores }
      ]}
    >
      <collaborator.List />
      <collaborator.SlidePanel />
    </InternalNavigationAndSlide>
  )
}
