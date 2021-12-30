import Base from '@/templates/Base'

import rotas from '@/domains/routes'

// TODO: Analisar separação de páginas em componentes no nível de domínio
import * as proposals from '@/domains/erp/commercial/Proposals'
import * as plans from '@/domains/erp/commercial/Plans'
import * as leads from '@/domains/erp/services/Leads'
import * as tickets from '@/domains/erp/services/Tickets'
import * as users from '@/domains/erp/identities/Users'
import * as combos from '@/domains/erp/commercial/Combos'
import * as services from '@/domains/erp/commercial/Services'
import * as products from '@/domains/erp/commercial/Products'

type CreateProposalProps = {
  Ticket: {
    Id: string
    CodigoReferencia: number
  } | null
}

export function CreateProposalPage({ Ticket }: CreateProposalProps) {
  Ticket ? (Ticket = JSON.parse(Ticket as unknown as string)) : null
  const { servicesLoading, refetch } = refetchActions()

  return (
    <Base
      title="Cadastro de Proposta"
      reload={{ action: refetch, state: servicesLoading }}
      currentLocation={breadCrumbData()}
    >
      <proposals.Create Ticket={Ticket} />
    </Base>
  )
}

function refetchActions() {
  const { servicesRefetch, servicesLoading } = services.useService()
  const { combosRefetch } = combos.useList()
  const { plansRefetch } = plans.useList()
  const { productsRefetch } = products.useProduct()
  const { leadsRefetch } = leads.useLead()
  const { ticketsRefetch } = tickets.useTicket()
  const { usersRefetch } = users.useUser()

  const refetch = () => {
    combosRefetch()
    plansRefetch()
    productsRefetch()
    leadsRefetch()
    ticketsRefetch()
    usersRefetch()
    servicesRefetch()
  }
  return { servicesLoading, refetch }
}

function breadCrumbData() {
  return [
    { title: 'Rastreamento', url: rotas.erp.home },
    { title: 'Comercial', url: rotas.erp.comercial.index },
    {
      title: 'Proposta',
      url: rotas.erp.comercial.propostas.index
    },
    {
      title: 'Cadastro',
      url: rotas.erp.comercial.propostas.cadastrar
    }
  ]
}
