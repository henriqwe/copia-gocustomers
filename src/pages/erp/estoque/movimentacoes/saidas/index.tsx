import { useSection } from 'hooks/useSection'

import * as exits from '@/domains/erp/inventory/Moves/Exits'

import rotas from '@/domains/routes'

import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'

export default function Exits() {
  const usuario = useSection()
  if (!usuario) return null
  return (
    <exits.ListProvider>
      <Page />
    </exits.ListProvider>
  )
}

export function Page() {
  const { outgoingOrdersRefetch, outgoingOrdersLoading } = exits.useList()
  return (
    <InternalNavigationAndSlide
      SubMenu={<exits.InternalNavigation />}
      title="Listagem de Saídas"
      reload={{
        action: outgoingOrdersRefetch,
        state: outgoingOrdersLoading
      }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Estoque', url: rotas.erp.estoque.index },
        {
          title: 'Movimentações',
          url: rotas.erp.estoque.movimentacoes.index
        },
        { title: 'Saídas', url: rotas.erp.estoque.movimentacoes.saidas.index }
      ]}
    >
      <exits.List />
    </InternalNavigationAndSlide>
  )
}
