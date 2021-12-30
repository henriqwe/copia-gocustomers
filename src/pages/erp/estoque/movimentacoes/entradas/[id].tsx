import { useSection } from 'hooks/useSection'

import * as entries from '@/domains/erp/inventory/Moves/Entries'

import rotas from '@/domains/routes'

import Base from '@/templates/Base'

export default function ValidateEntries() {
  const user = useSection()
  if (!user) return null
  return (
    <entries.ValidateProvider>
      <Page />
    </entries.ValidateProvider>
  )
}

export function Page() {
  return (
    <Base
      title="Entrada de pedidos de compra"
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Compras', url: rotas.erp.compras.index },
        {
          title: 'Movimentações',
          url: rotas.erp.estoque.movimentacoes.index
        },
        {
          title: 'Entradas',
          url: rotas.erp.estoque.movimentacoes.entradas.index
        }
      ]}
    >
      <entries.Validate />
    </Base>
  )
}
