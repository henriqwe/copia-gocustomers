import { useSection } from 'hooks/useSection'

import * as entries from '@/domains/erp/inventory/Moves/Entries'

import rotas from '@/domains/routes'

import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'

export default function Entries() {
  const user = useSection()
  if (!user) return null
  return (
    <entries.ListProvider>
      <Page />
    </entries.ListProvider>
  )
}

export function Page() {
  const { purchaseOrdersRefetch, purchaseOrdersLoading } = entries.useList()
  return (
    <InternalNavigationAndSlide
      SubMenu={<entries.InternalNavigation />}
      title="Listagem de Entradas"
      reload={{
        action: purchaseOrdersRefetch,
        state: purchaseOrdersLoading
      }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Estoque', url: rotas.erp.estoque.index },
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
      <entries.List />
    </InternalNavigationAndSlide>
  )
}
