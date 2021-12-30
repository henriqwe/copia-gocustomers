import { useSection } from 'hooks/useSection'

import * as itens from '@/domains/erp/inventory/Itens'

import rotas from '@/domains/routes'

import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'

export default function Itens() {
  const usuario = useSection()
  if (!usuario) return null
  return (
    <itens.ListProvider>
      <Pagina />
    </itens.ListProvider>
  )
}

export function Pagina() {
  const { itensRefetch, itensLoading } = itens.useList()
  return (
    <InternalNavigationAndSlide
      SubMenu={<itens.InternalNavigation />}
      title="Listagem de Itens"
      reload={{ action: itensRefetch, state: itensLoading }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Estoque', url: rotas.erp.estoque.index },
        { title: 'Itens', url: rotas.erp.estoque.itens.index }
      ]}
    >
      <itens.List />
    </InternalNavigationAndSlide>
  )
}
