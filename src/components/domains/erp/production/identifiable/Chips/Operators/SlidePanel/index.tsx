import * as blocks from '@/blocks'
import * as operators from '@/domains/erp/production/identifiable/Chips/Operators'

export default function SlidePanel() {
  const { slidePanelState, setSlidePanelState } = operators.useOperator()
  return (
    <blocks.Modal
      title={
        slidePanelState.type === 'create'
          ? 'Cadastrar Operadora'
          : 'Editar Operadora'
      }
      open={slidePanelState.open}
      handler={setSlidePanelState}
      formContent={
        slidePanelState.type === 'create' ? (
          <operators.Create />
        ) : (
          <operators.Update />
        )
      }
    />
  )
}
