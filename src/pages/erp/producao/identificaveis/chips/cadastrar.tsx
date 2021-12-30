import { useSection } from 'hooks/useSection'

import * as chips from '@/domains/erp/production/identifiable/Chips'
import * as operators from '@/domains/erp/production/identifiable/Chips/Operators'

import rotas from '@/domains/routes'

import Base from '@/templates/Base'

export default function CreateChips() {
  const user = useSection()
  if (!user) return null
  return (
    <chips.CreateProvider>
      <operators.OperatorProvider>
        <Page />
      </operators.OperatorProvider>
    </chips.CreateProvider>
  )
}

export function Page() {
  const { operatorsRefetch, operatorsLoading } = operators.useOperator()

  const refetch = () => {
    operatorsRefetch()
  }
  return (
    <Base
      title="Cadastro de chips"
      reload={{ action: refetch, state: operatorsLoading }}
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
          title: 'Cadastro',
          url: rotas.erp.producao.identificaveis.chips.cadastrar
        }
      ]}
    >
      <chips.Create />
    </Base>
  )
}
