import { useSection } from 'hooks/useSection'

import * as leads from '@/domains/erp/services/Leads'
import * as clients from '@/domains/erp/identities/Clients'

import rotas from '@/domains/routes'
import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'

export default function Leads() {
  const user = useSection()
  if (!user) return null
  return (
    <leads.LeadProvider>
      <clients.ListProvider>
        <Page />
      </clients.ListProvider>
    </leads.LeadProvider>
  )
}

export function Page() {
  const { leadsRefetch, leadsLoading } = leads.useLead()
  const { clientsRefetch } = clients.useList()
  const refetch = () => {
    clientsRefetch()
    leadsRefetch()
  }
  //const { usuario } = useUsuario()
  return (
    <InternalNavigationAndSlide
      SubMenu={<leads.InternalNavigation />}
      title="Leads"
      reload={{ action: refetch, state: leadsLoading }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Atendimento', url: rotas.erp.atendimento.index },
        {
          title: 'Leads',
          url: rotas.erp.atendimento.leads
        }
      ]}
    >
      <leads.List />
      <leads.SlidePanel />
    </InternalNavigationAndSlide>
  )
}
