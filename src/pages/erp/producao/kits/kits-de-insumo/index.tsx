import { useSection } from 'hooks/useSection'

import * as inputKits from '@/domains/erp/production/Kits/InputKits'

import rotas from '@/domains/routes'
import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'

export default function InputKit() {
  const user = useSection()
  if (!user) return null
  return (
    <inputKits.ListProvider>
      <Page />
    </inputKits.ListProvider>
  )
}

export function Page() {
  const { inputKitsRefetch, inputKitsLoading } = inputKits.useList()
  //const { usuario } = useUsuario()
  return (
    <InternalNavigationAndSlide
      SubMenu={<inputKits.InternalNavigation />}
      title="Kits de insumo de produção"
      reload={{
        action: inputKitsRefetch,
        state: inputKitsLoading
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
        }
      ]}
    >
      <inputKits.List />
    </InternalNavigationAndSlide>
  )
}
