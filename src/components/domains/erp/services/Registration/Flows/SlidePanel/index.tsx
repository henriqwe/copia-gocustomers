import * as blocks from '@/blocks'
import * as flows from '@/domains/erp/services/Registration/Flows'

export default function SlidePanel() {
  const { slidePanelState, setSlidePanelState } = flows.useFlow()
  return (
    <blocks.Modal
      title={
        slidePanelState.type === 'create' ? 'Cadastrar Fluxo' : 'Editar Fluxo'
      }
      open={slidePanelState.open}
      handler={setSlidePanelState}
      formContent={
        slidePanelState.type === 'create' ? <flows.Create /> : <flows.Update />
      }
    />
  )
}
