import { useSection } from 'hooks/useSection'

import * as services from '@/domains/erp/commercial/Services'
import * as combos from '@/domains/erp/commercial/Combos'
import * as plans from '@/domains/erp/commercial/Plans'
import * as products from '@/domains/erp/commercial/Products'

import rotas from '@/domains/routes'

import { UserProvider } from 'contexts/UserContext'
import Base from '@/templates/Base'

export default function CreateCombo() {
  const user = useSection()
  if (!user) return null
  return (
    <UserProvider>
      <combos.CreateProvider>
        <plans.ListProvider>
          <services.ServiceProvider>
            <products.ProductProvider>
              <Page />
            </products.ProductProvider>
          </services.ServiceProvider>
        </plans.ListProvider>
      </combos.CreateProvider>
    </UserProvider>
  )
}

export function Page() {
  const { productsRefetch, productsLoading } = products.useProduct()
  const { plansRefetch } = plans.useList()
  const { serviceRefetch } = services.useUpdate()

  const refetch = () => {
    productsRefetch()
    plansRefetch()
    serviceRefetch()
  }
  return (
    <Base
      title="Cadastro de Combo"
      reload={{ action: refetch, state: productsLoading }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Comercial', url: rotas.erp.comercial.index },
        {
          title: 'Combos',
          url: rotas.erp.comercial.combos.index
        },
        {
          title: 'Cadastro',
          url: rotas.erp.comercial.combos.cadastrar
        }
      ]}
    >
      <combos.Create />
    </Base>
  )
}
