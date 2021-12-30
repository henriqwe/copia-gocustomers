import { useSection } from 'hooks/useSection'

import * as kitsTypes from '@/domains/erp/production/Kits/InputKits/KitsTypes'

import rotas from '@/domains/routes'
import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'

export default function KitsTypes() {
  const user = useSection()
  if (!user) return null
  return (
    <kitsTypes.ListProvider>
      <Page />
    </kitsTypes.ListProvider>
  )
}

export function Page() {
  const { kitsTypesRefetch, kitsTypesLoading } = kitsTypes.useList()
  //const { usuario } = useUsuario()
  return (
    <InternalNavigationAndSlide
      SubMenu={<kitsTypes.InternalNavigation />}
      title="Tipos de Kits de produção"
      reload={{
        action: kitsTypesRefetch,
        state: kitsTypesLoading
      }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        {
          title: 'Produção',
          url: rotas.erp.producao.identificaveis.chips.index
        },
        {
          title: 'Kits de insumo',
          url: rotas.erp.producao.kits.kitsDeInsumo.index
        },
        {
          title: 'Tipos',
          url: rotas.erp.producao.kits.kitsDeInsumo.tipos.index
        }
      ]}
    >
      <kitsTypes.List />
    </InternalNavigationAndSlide>
  )
}
