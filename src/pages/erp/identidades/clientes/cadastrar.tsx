import rotas from '@/domains/routes'

import { useSection } from 'hooks/useSection'

import Base from '@/templates/Base'

import * as clients from '@/domains/erp/identities/Clients'

export default function CreateClient() {
  const user = useSection()
  if (!user) return null
  return (
    <clients.CreateProvider>
      <Page />
    </clients.CreateProvider>
  )
}

function Page() {
  return (
    <Base
      title="Cadastro de Cliente"
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        {
          title: 'Identidades',
          url: ''
        },
        {
          title: 'Clientes',
          url: rotas.erp.identidades.clientes.index
        },
        {
          title: 'Cadastro',
          url: rotas.erp.identidades.clientes.cadastrar
        }
      ]}
    >
      <clients.Create />
    </Base>
  )
}
