import rotas from '@/domains/routes'

import { useSection } from 'hooks/useSection'
import FormAndTabs from '@/templates/FormAndTabs'

import * as providers from '@/domains/erp/commercial/Providers'

export default function UpdateProvider() {
  const user = useSection()
  if (!user) return null
  return (
    <providers.UpdateProvider>
      <providers.Products.ProductProvider>
        <providers.Services.ServiceProvider>
          <Page />
        </providers.Services.ServiceProvider>
      </providers.Products.ProductProvider>
    </providers.UpdateProvider>
  )
}

function Page() {
  const { providerLoading, providerRefetch } = providers.useUpdate()
  const { productsRefetch } = providers.Products.useProduct()
  const { servicesRefetch } = providers.Services.useService()

  const refetch = () => {
    providerRefetch()
    productsRefetch()
    servicesRefetch()
  }

  return (
    <FormAndTabs
      Form={<providers.Update />}
      title="Parceiro"
      reload={{
        action: refetch,
        state: providerLoading
      }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Comercial', url: rotas.erp.comercial.index },
        {
          title: 'Parceiros',
          url: rotas.erp.comercial.fornecedores
        }
      ]}
    >
      <providers.Tabs />
    </FormAndTabs>
  )
}
