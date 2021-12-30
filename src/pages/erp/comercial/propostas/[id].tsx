import { useSection } from 'hooks/useSection'

import * as proposals from '@/domains/erp/commercial/Proposals'
import * as services from '@/domains/erp/commercial/Services'
import * as combos from '@/domains/erp/commercial/Combos'
import * as plans from '@/domains/erp/commercial/Plans'
import * as products from '@/domains/erp/commercial/Products'
import * as vehicles from '@/domains/erp/services/Vehicles'
import * as clients from '@/domains/erp/identities/Clients'

import rotas from '@/domains/routes'

import { UserProvider } from 'contexts/UserContext'
import Base from '@/templates/Base'

export default function ProposalDetails() {
  const user = useSection()
  if (!user) return null
  return (
    <UserProvider>
      <proposals.ViewProvider>
        <proposals.CreateProvider>
          <combos.ListProvider>
            <plans.ListProvider>
              <services.ServiceProvider>
                <products.ProductProvider>
                  <vehicles.VehicleProvider>
                    <clients.ListProvider>
                      <clients.CreateProvider>
                        <Page />
                      </clients.CreateProvider>
                    </clients.ListProvider>
                  </vehicles.VehicleProvider>
                </products.ProductProvider>
              </services.ServiceProvider>
            </plans.ListProvider>
          </combos.ListProvider>
        </proposals.CreateProvider>
      </proposals.ViewProvider>
    </UserProvider>
  )
}

export function Page() {
  const { proposalRefetch, proposalLoading, proposalInstallationsRefetch } =
    proposals.useView()
  const { servicesRefetch } = services.useService()
  const { combosRefetch } = combos.useList()
  const { plansRefetch } = plans.useList()
  const { productsRefetch } = products.useProduct()
  const { vehiclesRefetch } = vehicles.useVehicle()
  const { clientsRefetch } = clients.useList()

  const refetch = () => {
    combosRefetch()
    plansRefetch()
    productsRefetch()
    servicesRefetch()
    vehiclesRefetch()
    clientsRefetch()
    proposalInstallationsRefetch()
    proposalRefetch()
  }
  return (
    <Base
      title="Detalhe de Proposta"
      reload={{ action: refetch, state: proposalLoading }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Comercial', url: rotas.erp.comercial.index },
        {
          title: 'Proposta',
          url: rotas.erp.comercial.propostas.index
        }
      ]}
    >
      <proposals.View />
    </Base>
  )
}
