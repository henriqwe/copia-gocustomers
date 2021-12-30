import { useSection } from 'hooks/useSection'

import * as conditionals from '@/domains/erp/commercial/Registration/Conditionals'
import * as services from '@/domains/erp/commercial/Services'
import * as plans from '@/domains/erp/commercial/Plans'

import rotas from '@/domains/routes'

import { UserProvider } from 'contexts/UserContext'
import Base from '@/templates/Base'

export default function CreatePlan() {
  const user = useSection()
  if (!user) return null
  return (
    <UserProvider>
      <plans.CreateProvider>
        <services.ServiceProvider>
          <conditionals.ConditionalProvider>
            <Page />
          </conditionals.ConditionalProvider>
        </services.ServiceProvider>
      </plans.CreateProvider>
    </UserProvider>
  )
}

export function Page() {
  const { servicesRefetch, servicesLoading } = services.useService()
  const { conditionalRefetch } = conditionals.useConditional()

  const refetch = () => {
    servicesRefetch()
    conditionalRefetch()
  }
  return (
    <Base
      title="Cadastro de Plano"
      reload={{ state: servicesLoading, action: refetch }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Comercial', url: rotas.erp.comercial.index },
        {
          title: 'Planos',
          url: rotas.erp.comercial.planos.index
        },
        {
          title: 'Cadastro',
          url: rotas.erp.comercial.planos.cadastrar
        }
      ]}
    >
      <plans.Create />
    </Base>
  )
}
