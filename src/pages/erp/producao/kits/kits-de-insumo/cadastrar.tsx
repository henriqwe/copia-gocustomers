import { useSection } from 'hooks/useSection'

import * as inputKits from '@/domains/erp/production/Kits/InputKits'
import * as kitsTypes from '@/domains/erp/production/Kits/InputKits/KitsTypes'

import rotas from '@/domains/routes'

import Base from '@/templates/Base'

export default function CreateInputKit() {
  const user = useSection()
  if (!user) return null
  return (
    <inputKits.CreateProvider>
      <kitsTypes.ListProvider>
        <Page />
      </kitsTypes.ListProvider>
    </inputKits.CreateProvider>
  )
}

export function Page() {
  const { kitsTypesRefetch, kitsTypesLoading } = kitsTypes.useList()
  return (
    <Base
      title="Cadastro de Kits de insumo"
      reload={{ action: kitsTypesRefetch, state: kitsTypesLoading }}
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
          title: 'Cadastro',
          url: rotas.erp.producao.kits.kitsDeInsumo.cadastrar
        }
      ]}
    >
      <inputKits.Create />
    </Base>
  )
}
