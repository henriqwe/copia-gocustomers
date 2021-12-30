import * as blocks from '@/blocks'
import * as coverages from '@/domains/erp/commercial/Registration/Coverages'

export default function SlidePanel() {
  const { slidePanelState, setSlidePanelState } = coverages.useCoverage()
  return (
    <blocks.Modal
      title={
        slidePanelState.type === 'create'
          ? 'Cadastrar Cobertura'
          : 'Editar Cobertura'
      }
      open={slidePanelState.open}
      handler={setSlidePanelState}
      formContent={
        slidePanelState.type === 'create' ? (
          <coverages.Create />
        ) : (
          <coverages.Update />
        )
      }
    />
  )
}
