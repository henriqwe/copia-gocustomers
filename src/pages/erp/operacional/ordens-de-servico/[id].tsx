import rotas from '@/domains/routes'

import { useSection } from 'hooks/useSection'
import FormAndTabs from '@/templates/FormAndTabs'

import * as serviceOrders from '@/domains/erp/operational/ServiceOrders'

export default function UpdateServiceOrder() {
  const user = useSection()
  if (!user) return null
  return (
    <serviceOrders.UpdateProvider>
      <serviceOrders.activities.ActivitiesProvider>
        <Page />
      </serviceOrders.activities.ActivitiesProvider>
    </serviceOrders.UpdateProvider>
  )
}

function Page() {
  const { serviceOrderLoading, serviceOrderRefetch } = serviceOrders.useUpdate()
  const { serviceOrderActivitiesRefetch } =
    serviceOrders.activities.useActivities()

  const refetch = () => {
    serviceOrderActivitiesRefetch()
    serviceOrderRefetch()
  }

  return (
    <FormAndTabs
      Form={<serviceOrders.Update />}
      title="Ordem de serviço"
      reload={{
        action: refetch,
        state: serviceOrderLoading
      }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Operacional', url: rotas.erp.operacional.index },
        {
          title: 'Ordens de serviço',
          url: rotas.erp.operacional.ordensDeServico
        }
      ]}
    >
      <serviceOrders.Tabs />
    </FormAndTabs>
  )
}
