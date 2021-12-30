import rotas from '@/domains/routes'

import { useSection } from 'hooks/useSection'

import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'
import * as providers from '@/domains/erp/identities/Providers'

export default function Providers() {
  const usuario = useSection()
  if (!usuario) return null
  return (
    <providers.ListProvider>
      <Page />
    </providers.ListProvider>
  )
}

function Page() {
  const { providersRefetch, providersLoading } = providers.useList()
  return (
    <InternalNavigationAndSlide
      SubMenu={<providers.InternalNavigation />}
      title="Listagem de Fornecedores"
      reload={{
        action: providersRefetch,
        state: providersLoading
      }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Identidades', url: rotas.erp.identidades.index },
        {
          title: 'Fornecedores',
          url: rotas.erp.identidades.fornecedores.index
        }
      ]}
    >
      <providers.List />
    </InternalNavigationAndSlide>
  )
}
