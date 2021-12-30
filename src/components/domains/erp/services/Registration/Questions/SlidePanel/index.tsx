import * as blocks from '@/blocks'
import * as questions from '@/domains/erp/services/Registration/Questions'

export default function SlidePanel() {
  const { slidePanelState, setSlidePanelState } = questions.useQuestion()
  return (
    <blocks.Modal
      title={
        slidePanelState.type === 'create'
          ? 'Cadastrar Pergunta'
          : 'Editar Pergunta'
      }
      open={slidePanelState.open}
      handler={setSlidePanelState}
      formContent={
        slidePanelState.type === 'create' ? (
          <questions.Create />
        ) : (
          <questions.Update />
        )
      }
    />
  )
}
