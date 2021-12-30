import { useSection } from 'hooks/useSection'

import * as chips from '@/domains/erp/production/identifiable/Chips'
import * as operators from '@/domains/erp/production/identifiable/Chips/Operators'

import rotas from '@/domains/routes'

import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'

export default function Chips() {
  const user = useSection()
  if (!user) return null
  return (
    <chips.ChipsProvider>
      <operators.OperatorProvider>
        <Page />
      </operators.OperatorProvider>
    </chips.ChipsProvider>
  )
}

export function Page() {
  const { chipsRefetch, chipsLoading } = chips.useChips()
  const { operatorsRefetch } = operators.useOperator()

  const refetch = () => {
    chipsRefetch()
    operatorsRefetch()
  }
  return (
    <InternalNavigationAndSlide
      SubMenu={<chips.InternalNavigation />}
      title="Chips de estoque"
      reload={{ action: refetch, state: chipsLoading }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        {
          title: 'Produção',
          url: rotas.erp.producao.identificaveis.chips.index
        },
        {
          title: 'Chips',
          url: rotas.erp.producao.identificaveis.chips.index
        }
      ]}
    >
      <chips.List />
      <chips.SlidePanel />
    </InternalNavigationAndSlide>
  )
}
