import { useSection } from 'hooks/useSection'

import * as contracts from '@/domains/erp/commercial/Contracts'
import * as partners from '@/domains/erp/commercial/Providers'

import rotas from '@/domains/routes'
import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'

export default function Contracts() {
  const user = useSection()
  if (!user) return null
  return (
    <contracts.ContractProvider>
      <partners.ProviderProvider>
        <Page />
      </partners.ProviderProvider>
    </contracts.ContractProvider>
  )
}

export function Page() {
  const { baseContractsRefetch, baseContractsLoading } = contracts.useContract()
  const { providersRefetch } = partners.useProvider()
  const refetch = () => {
    providersRefetch()
    baseContractsRefetch()
  }
  return (
    <InternalNavigationAndSlide
      SubMenu={<contracts.InternalNavigation />}
      title="Contratos"
      reload={{ action: refetch, state: baseContractsLoading }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Comercial', url: rotas.erp.comercial.index },
        {
          title: 'Contratos',
          url: rotas.erp.comercial.contratos
        }
      ]}
    >
      <contracts.List />
      <contracts.SlidePanel />
    </InternalNavigationAndSlide>
  )
}
