import { useSection } from 'hooks/useSection'

import * as tickets from '@/domains/erp/services/Tickets'
import * as flows from '@/domains/erp/services/Registration/Flows'
import * as users from '@/domains/erp/identities/Users'
import * as leads from '@/domains/erp/services/Leads'
import * as clients from '@/domains/erp/identities/Clients'

import rotas from '@/domains/routes'
import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'

export default function Tickets() {
  const user = useSection()
  if (!user) return null
  return (
    <tickets.TicketProvider>
      <flows.FlowProvider>
        <users.UserProvider>
          <leads.LeadProvider>
            <clients.ListProvider>
              <Page />
            </clients.ListProvider>
          </leads.LeadProvider>
        </users.UserProvider>
      </flows.FlowProvider>
    </tickets.TicketProvider>
  )
}

export function Page() {
  const { ticketsRefetch, ticketsLoading } = tickets.useTicket()
  const { flowsRefetch } = flows.useFlow()
  const { usersRefetch } = users.useUser()
  const { leadsRefetch } = leads.useLead()
  const { clientsRefetch } = clients.useList()
  const refetch = () => {
    flowsRefetch()
    usersRefetch()
    leadsRefetch()
    ticketsRefetch()
    clientsRefetch()
  }
  //const { usuario } = useUsuario()
  return (
    <InternalNavigationAndSlide
      SubMenu={<tickets.InternalNavigation />}
      title="Tickets"
      reload={{ action: refetch, state: ticketsLoading }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Atendimento', url: rotas.erp.atendimento.index },
        {
          title: 'Tickets',
          url: rotas.erp.atendimento.tickets
        }
      ]}
    >
      <tickets.List />
      <tickets.SlidePanel />
    </InternalNavigationAndSlide>
  )
}
