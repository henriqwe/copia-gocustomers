import * as blocks from '@/blocks'
import * as chips from '@/domains/erp/production/identifiable/Chips'

export default function SlidePanel() {
  const { slidePanelState, setSlidePanelState } = chips.useChips()
  return (
    <blocks.Modal
      title={'Editar Chip'}
      open={slidePanelState.open}
      handler={setSlidePanelState}
      formContent={<chips.Update />}
    />
  )
}
