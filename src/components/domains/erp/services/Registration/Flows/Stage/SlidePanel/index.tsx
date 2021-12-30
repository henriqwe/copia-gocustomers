import * as blocks from '@/blocks'
import * as flowStages from '@/domains/erp/services/Registration/Flows/Stage'

export default function SlidePanel() {
  const { slidePanelState, setSlidePanelState } = flowStages.useStage()
  return (
    <blocks.Modal
      title={
        slidePanelState.type === 'create'
          ? 'Cadastrar Etapa de fluxo'
          : 'Editar Etapa de fluxo'
      }
      open={slidePanelState.open}
      handler={setSlidePanelState}
      formContent={
        slidePanelState.type === 'create' ? (
          <flowStages.Create />
        ) : (
          <flowStages.Update />
        )
      }
    />
  )
}
