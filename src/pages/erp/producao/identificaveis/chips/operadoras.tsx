import { useSection } from 'hooks/useSection'

import * as operators from '@/domains/erp/production/identifiable/Chips/Operators'

import rotas from '@/domains/routes'
import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'

export default function Operators() {
  const user = useSection()
  if (!user) return null
  return (
    <operators.OperatorProvider>
      <Page />
    </operators.OperatorProvider>
  )
}

export function Page() {
  const { operatorsRefetch, operatorsLoading } = operators.useOperator()
  //const { usuario } = useUsuario()
  return (
    <InternalNavigationAndSlide
      SubMenu={<operators.InternalNavigation />}
      title="Operadoras de estoque"
      reload={{
        action: operatorsRefetch,
        state: operatorsLoading
      }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        {
          title: 'Produção',
          url: rotas.erp.producao.identificaveis.chips.index
        },
        {
          title: 'Chips',
          url: rotas.erp.producao.identificaveis.chips.index
        },
        {
          title: 'Operadoras',
          url: rotas.erp.producao.identificaveis.chips.operadoras
        }
      ]}
    >
      <operators.List />
      <operators.SlidePanel />
    </InternalNavigationAndSlide>
  )
}
