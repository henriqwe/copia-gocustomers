import { useSection } from 'hooks/useSection'

import * as vehicles from '@/domains/erp/services/Vehicles'
import * as clients from '@/domains/erp/identities/Clients'

import rotas from '@/domains/routes'
import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'

export default function Vehicles() {
  const user = useSection()
  if (!user) return null
  return (
    <vehicles.VehicleProvider>
      <clients.ListProvider>
        <Page />
      </clients.ListProvider>
    </vehicles.VehicleProvider>
  )
}

export function Page() {
  const { vehiclesRefetch, vehiclesLoading } = vehicles.useVehicle()
  const { clientsRefetch } = clients.useList()
  const refetch = () => {
    clientsRefetch()
    vehiclesRefetch()
  }
  //const { usuario } = useUsuario()
  return (
    <InternalNavigationAndSlide
      SubMenu={<vehicles.InternalNavigation />}
      title="Veículos"
      reload={{ action: refetch, state: vehiclesLoading }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Atendimento', url: rotas.erp.atendimento.index },
        {
          title: 'Veículos',
          url: rotas.erp.atendimento.vehicles
        }
      ]}
    >
      <vehicles.List />
      <vehicles.SlidePanel />
    </InternalNavigationAndSlide>
  )
}
