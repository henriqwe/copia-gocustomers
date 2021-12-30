import { useSection } from 'hooks/useSection'

import * as providers from '@/domains/erp/commercial/Providers'

import rotas from '@/domains/routes'
import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'

export default function Providers() {
  const user = useSection()
  if (!user) return null
  return (
    <providers.ProviderProvider>
      <Page />
    </providers.ProviderProvider>
  )
}

export function Page() {
  const { providersRefetch, providersLoading } = providers.useProvider()
  const refetch = () => {
    providersRefetch()
  }
  //const { usuario } = useUsuario()
  return (
    <InternalNavigationAndSlide
      SubMenu={<providers.InternalNavigation />}
      title="Parceiros"
      reload={{ action: refetch, state: providersLoading }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Comercial', url: rotas.erp.comercial.index },
        {
          title: 'Parceiros',
          url: rotas.erp.comercial.fornecedores
        }
      ]}
    >
      <providers.List />
      <providers.SlidePanel />
    </InternalNavigationAndSlide>
  )
}
