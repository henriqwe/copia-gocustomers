import { useSection } from 'hooks/useSection'

import * as conditionals from '@/domains/erp/commercial/Registration/Conditionals'
import * as services from '@/domains/erp/commercial/Services'
import * as plans from '@/domains/erp/commercial/Plans'

import rotas from '@/domains/routes'

import { UserProvider } from 'contexts/UserContext'
import Base from '@/templates/Base'

export default function UpdatePlan() {
  const user = useSection()
  if (!user) return null
  return (
    <UserProvider>
      <plans.UpdateProvider>
        <services.ServiceProvider>
          <conditionals.ConditionalProvider>
            <Page />
          </conditionals.ConditionalProvider>
        </services.ServiceProvider>
      </plans.UpdateProvider>
    </UserProvider>
  )
}

export function Page() {
  const { plansRefetch, plansLoading } = plans.useUpdate()
  const { servicesRefetch } = services.useService()
  const { conditionalRefetch } = conditionals.useConditional()

  const refetch = () => {
    servicesRefetch()
    conditionalRefetch()
    plansRefetch()
  }
  return (
    <Base
      title="Edição de Plano"
      reload={{ state: plansLoading, action: refetch }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Comercial', url: rotas.erp.comercial.index },
        {
          title: 'Planos',
          url: rotas.erp.comercial.planos.index
        }
      ]}
    >
      <plans.Update />
    </Base>
  )
}
