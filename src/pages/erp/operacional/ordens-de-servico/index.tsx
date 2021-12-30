import { useSection } from 'hooks/useSection'

import * as serviceOrders from '@/domains/erp/operational/ServiceOrders'

import rotas from '@/domains/routes'
import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'

export default function ServiceOrders() {
  const user = useSection()
  if (!user) return null
  return (
    <serviceOrders.ServiceOrderProvider>
      <Page />
    </serviceOrders.ServiceOrderProvider>
  )
}

export function Page() {
  const { serviceOrdersRefetch, serviceOrdersLoading } =
    serviceOrders.useServiceOrder()
  const refetch = () => {
    serviceOrdersRefetch()
  }
  return (
    <InternalNavigationAndSlide
      SubMenu={<serviceOrders.InternalNavigation />}
      title="Ordens de Serviço"
      reload={{ action: refetch, state: serviceOrdersLoading }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Operacional', url: rotas.erp.operacional.index },
        {
          title: 'Ordens de serviço',
          url: rotas.erp.operacional.ordensDeServico
        }
      ]}
    >
      <serviceOrders.List />
      <serviceOrders.SlidePanel />
    </InternalNavigationAndSlide>
  )
}
