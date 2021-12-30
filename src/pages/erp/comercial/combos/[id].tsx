import { useSection } from 'hooks/useSection'

import * as combos from '@/domains/erp/commercial/Combos'
import * as plans from '@/domains/erp/commercial/Plans'
import * as products from '@/domains/erp/commercial/Products'
import * as services from '@/domains/erp/commercial/Services'

import rotas from '@/domains/routes'

import { UserProvider } from 'contexts/UserContext'
import FormAndTabs from '@/templates/FormAndTabs'
import Base from '@/templates/Base'

export default function ProposalDetails() {
  const user = useSection()
  if (!user) return null
  return (
    <UserProvider>
      <combos.ViewProvider>
        <plans.ListProvider>
          <products.ProductProvider>
            <services.ServiceProvider>
              <combos.combos.DependenceComboProvider>
                <Page />
              </combos.combos.DependenceComboProvider>
            </services.ServiceProvider>
          </products.ProductProvider>
        </plans.ListProvider>
      </combos.ViewProvider>
    </UserProvider>
  )
}

export function Page() {
  const { comboRefetch, comboLoading, comboData } = combos.useView()
  const { combosRefetch, dependenciesCombosRefetch } =
    combos.combos.useDependenceCombo()
  const { productsRefetch } = products.useProduct()
  const { plansRefetch } = plans.useList()
  const { servicesRefetch } = services.useService()

  const refetch = () => {
    productsRefetch()
    plansRefetch()
    servicesRefetch()
    combosRefetch()
    dependenciesCombosRefetch()
    comboRefetch()
  }

  if ((comboData?.ComboPai.length || 0) > 0) {
    return (
      <Base
        title="Detalhe de Combo"
        reload={{ action: refetch, state: comboLoading }}
        currentLocation={[
          { title: 'Rastreamento', url: rotas.erp.home },
          { title: 'Comercial', url: rotas.erp.comercial.index },
          {
            title: 'Combos',
            url: rotas.erp.comercial.combos.index
          }
        ]}
      >
        <combos.View />
      </Base>
    )
  }
  return (
    <FormAndTabs
      Form={<combos.View />}
      title="Detalhe de Combo"
      reload={{ action: refetch, state: comboLoading }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Comercial', url: rotas.erp.comercial.index },
        {
          title: 'Combos',
          url: rotas.erp.comercial.combos.index
        }
      ]}
    >
      <combos.Tabs />
    </FormAndTabs>
  )
}
