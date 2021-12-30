import { useSection } from 'hooks/useSection'

import * as identifiers from '@/domains/erp/production/identifiable/Identifiers'

import rotas from '@/domains/routes'
import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'

export default function Identifiers() {
  const user = useSection()
  if (!user) return null
  return (
    <identifiers.IdentifierProvider>
      <Page />
    </identifiers.IdentifierProvider>
  )
}

export function Page() {
  const { identifiersRefetch, identifiersLoading } = identifiers.useIdentifier()
  //const { usuario } = useUsuario()
  return (
    <InternalNavigationAndSlide
      SubMenu={<identifiers.InternalNavigation />}
      title="Identificadores de estoque"
      reload={{
        action: identifiersRefetch,
        state: identifiersLoading
      }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        {
          title: 'Produção',
          url: rotas.erp.producao.identificaveis.chips.index
        },
        {
          title: 'Identificadores',
          url: rotas.erp.producao.identificaveis.identificadores.index
        }
      ]}
    >
      <identifiers.List />
      <identifiers.SlidePanel />
    </InternalNavigationAndSlide>
  )
}
