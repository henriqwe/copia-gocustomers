import rotas from '@/domains/routes'

import { useSection } from 'hooks/useSection'
import FormAndTabs from '@/templates/FormAndTabs'

import * as clients from '@/domains/erp/identities/Clients'

export default function UpdateClient() {
  const user = useSection()
  if (!user) return null
  return (
    <clients.Addresses.AddressProvider>
      <clients.Emails.EmailProvider>
        <clients.Phones.PhoneProvider>
          <clients.UpdateProvider>
            <clients.Representative.RepresentativeProvider>
              <clients.Doucments.DocumentProvider>
                <clients.users.UserProvider>
                  <Page />
                </clients.users.UserProvider>
              </clients.Doucments.DocumentProvider>
            </clients.Representative.RepresentativeProvider>
          </clients.UpdateProvider>
        </clients.Phones.PhoneProvider>
      </clients.Emails.EmailProvider>
    </clients.Addresses.AddressProvider>
  )
}

function Page() {
  const { clientData, clientLoading, clientRefetch } = clients.useUpdate()
  const { addressesRefetch } = clients.Addresses.useAddress()
  const { emailsRefetch } = clients.Emails.useEmail()
  const { phonesRefetch } = clients.Phones.usePhone()
  const { representativesDataRefetch } =
    clients.Representative.useRepresentative()

  const refetch = () => {
    representativesDataRefetch()
    addressesRefetch()
    emailsRefetch()
    phonesRefetch()
    clientRefetch()
  }
  let titulo = clientData?.Pessoa.Nome || ''
  if (clientData?.Pessoa.PessoaJuridica)
    titulo = clientData?.Pessoa.DadosDaApi.alias

  return (
    <FormAndTabs
      Form={<clients.Update />}
      title={`${titulo}`}
      reload={{
        action: refetch,
        state: clientLoading
      }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        {
          title: 'Identidades',
          url: rotas.erp.identidades.index
        },
        {
          title: 'Clientes',
          url: rotas.erp.identidades.clientes.index
        }
      ]}
    >
      <clients.Tabs />
    </FormAndTabs>
  )
}
