import { useSection } from 'hooks/useSection'

import * as inputKits from '@/domains/erp/production/Kits/InputKits'

import rotas from '@/domains/routes'

import Base from '@/templates/Base'

export default function GiveBackInputKit() {
  const user = useSection()
  if (!user) return null
  return (
    <inputKits.GiveBackProvider>
      <Page />
    </inputKits.GiveBackProvider>
  )
}

export function Page() {
  return (
    <Base
      title="Devolução de itens do Kit de insumo"
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
      <inputKits.GiveBack />
    </Base>
  )
}
