import rotas from '@/domains/routes'

import { useSection } from 'hooks/useSection'
import FormAndTabs from '@/templates/FormAndTabs'

import * as contracts from '@/domains/erp/commercial/Contracts'
import * as partners from '@/domains/erp/commercial/Providers'

export default function UpdateProduct() {
  const user = useSection()
  if (!user) return null
  return (
    <contracts.UpdateProvider>
      <partners.ProviderProvider>
        <contracts.versions.ContractVersionsProvider>
          <Page />
        </contracts.versions.ContractVersionsProvider>
      </partners.ProviderProvider>
    </contracts.UpdateProvider>
  )
}

function Page() {
  const { baseContractsRefetch, baseContractsLoading } = contracts.useContract()
  const { contractVersionsRefetch } = contracts.versions.useContractVersions()
  const { providersRefetch } = partners.useProvider()

  const refetch = () => {
    providersRefetch()
    contractVersionsRefetch()
    baseContractsRefetch()
  }

  return (
    <FormAndTabs
      Form={<contracts.Update />}
      title="Contratos"
      reload={{
        action: refetch,
        state: baseContractsLoading
      }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Comercial', url: rotas.erp.comercial.index },
        {
          title: 'Contratos',
          url: rotas.erp.comercial.contratos
        }
      ]}
    >
      <contracts.Tabs />
    </FormAndTabs>
  )
}
