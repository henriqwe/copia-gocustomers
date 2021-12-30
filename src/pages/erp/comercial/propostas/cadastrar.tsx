import { useSection } from 'hooks/useSection'

import { GetServerSideProps } from 'next'

// TODO: Retirar todos os UserProvider de páginas para usar middlewares
import { UserProvider } from 'contexts/UserContext'

import * as proposals from '@/domains/erp/commercial/Proposals'
import * as services from '@/domains/erp/commercial/Services'
import * as combos from '@/domains/erp/commercial/Combos'
import * as plans from '@/domains/erp/commercial/Plans'
import * as products from '@/domains/erp/commercial/Products'
import * as tickets from '@/domains/erp/services/Tickets'

import { CreateProposalPage } from '@/pages/CreateProposal'

type CreateProposalProps = {
  Ticket: {
    Id: string
    CodigoReferencia: number
  } | null
}

export default function CreateProposal({ Ticket }: CreateProposalProps) {
  const user = useSection()
  if (!user) return null
  return (
    // TODO: analisar comportamento e estrutura de contextos no uso de páginas
    <UserProvider>
      <proposals.CreateProvider>
        <combos.ListProvider>
          <plans.ListProvider>
            <services.ServiceProvider>
              <products.ProductProvider>
                <tickets.TicketProvider>
                  <CreateProposalPage Ticket={Ticket} />
                </tickets.TicketProvider>
              </products.ProductProvider>
            </services.ServiceProvider>
          </plans.ListProvider>
        </combos.ListProvider>
      </proposals.CreateProvider>
    </UserProvider>
  )
}

export const getServerSideProps: GetServerSideProps = async (props) => {
  return {
    props: {
      Ticket: props.query.Ticket || null
    }
  }
}
