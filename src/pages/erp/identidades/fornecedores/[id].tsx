import rotas from '@/domains/routes'

import { useSection } from 'hooks/useSection'

import FormAndTabs from '@/templates/FormAndTabs'

import * as providers from '@/domains/erp/identities/Providers'

export default function UpdateProvider() {
  const user = useSection()
  if (!user) return null
  return (
    <providers.Addresses.AddressProvider>
      <providers.Sellers.SellerProvider>
        <providers.Services.ServiceProvider>
          <providers.UpdateProvider>
            <Page />
          </providers.UpdateProvider>
        </providers.Services.ServiceProvider>
      </providers.Sellers.SellerProvider>
    </providers.Addresses.AddressProvider>
  )
}

function Page() {
  const { providerData, providerLoading, providerRefetch } =
    providers.useUpdate()
  const { addressesRefetch } = providers.Addresses.useAdress()
  const { sellersRefetch } = providers.Sellers.useSeller()
  const { servicesRefetch } = providers.Services.useService()
  let titulo = providerData?.Pessoa.Nome || ''
  if (providerData?.Pessoa.PessoaJuridica) {
    titulo = providerData?.Pessoa.DadosDaApi.razaoSocial
  }

  const refetch = () => {
    addressesRefetch()
    sellersRefetch()
    servicesRefetch()
    providerRefetch()
  }
  return (
    <FormAndTabs
      Form={<providers.Update />}
      title={`${titulo}`}
      reload={{
        action: refetch,
        state: providerLoading
      }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Identidades', url: rotas.erp.identidades.index },
        {
          title: 'Fornecedores',
          url: rotas.erp.identidades.fornecedores.cadastrar
        }
      ]}
    >
      <providers.Tabs />
    </FormAndTabs>
  )
}
