import { useSection } from 'hooks/useSection'

import * as kitsTypes from '@/domains/erp/production/Kits/InputKits/KitsTypes'
import * as itens from '@/domains/erp/inventory/Itens'

import rotas from '@/domains/routes'

import Base from '@/templates/Base'

export default function KitsTypes() {
  const user = useSection()
  if (!user) return null
  return (
    <kitsTypes.CreateProvider>
      <itens.ListProvider>
        <Page />
      </itens.ListProvider>
    </kitsTypes.CreateProvider>
  )
}

export function Page() {
  const { itensRefetch, itensLoading } = itens.useList()
  return (
    <Base
      title="Cadastro de Tipos De Kit"
      reload={{ action: itensRefetch, state: itensLoading }}
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
        },
        {
          title: 'Cadastro',
          url: rotas.erp.producao.kits.kitsDeInsumo.tipos.cadastrar
        }
      ]}
    >
      <kitsTypes.Create />
    </Base>
  )
}
