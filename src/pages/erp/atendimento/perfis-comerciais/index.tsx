import { useSection } from 'hooks/useSection'

import * as businessProfiles from '@/domains/erp/services/BusinessProfiles'

import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'
import rotas from '@/domains/routes'

export default function BusinessProfiles() {
  const user = useSection()
  if (!user) return null
  return (
    <businessProfiles.BusinessProfileProvider>
      <Page />
    </businessProfiles.BusinessProfileProvider>
  )
}

export function Page() {
  const { businessProfilesRefetch, businessProfilesLoading } =
    businessProfiles.useBusinessProfile()
  return (
    <InternalNavigationAndSlide
      SubMenu={<businessProfiles.InternalNavigation />}
      title="Perfis Comerciais"
      reload={{
        action: businessProfilesRefetch,
        state: businessProfilesLoading
      }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Atendimento', url: rotas.erp.atendimento.index },
        {
          title: 'Perfis Comerciais',
          url: rotas.erp.atendimento.perfisComerciais.index
        }
      ]}
    >
      <businessProfiles.List />
      <businessProfiles.SlidePanel />
    </InternalNavigationAndSlide>
  )
}
