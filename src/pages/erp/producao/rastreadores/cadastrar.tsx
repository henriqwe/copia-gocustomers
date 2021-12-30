import { useSection } from 'hooks/useSection'

import * as trackers from '@/domains/erp/production/Trackers'

import rotas from '@/domains/routes'

import Base from '@/templates/Base'

export default function CreateTrackers() {
  const user = useSection()
  if (!user) return null
  return (
    <trackers.CreateProvider>
      <Page />
    </trackers.CreateProvider>
  )
}

export function Page() {
  return (
    <Base
      title="Cadastro de Rastreadores"
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        {
          title: 'Produção',
          url: rotas.erp.producao.identificaveis.chips.index
        },
        {
          title: 'Rastreadores',
          url: rotas.erp.producao.rastreadores.index
        },
        {
          title: 'Cadastro',
          url: rotas.erp.producao.rastreadores.cadastrar
        }
      ]}
    >
      <trackers.Create />
    </Base>
  )
}
