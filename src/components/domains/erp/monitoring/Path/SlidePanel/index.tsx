import * as blocks from '@/blocks'
import * as paths from '@/domains/erp/monitoring/Path'

export default function SlidePanel() {
  const { slidePanelState, setSlidePanelState } = paths.usePath()
  return (
    <blocks.Modal
      title={'Histórico'}
      open={slidePanelState.open}
      handler={setSlidePanelState}
      formContent={<paths.HistoricPath />}
      chevronDoubleRightIcon
      noOverlay
    />
  )
}
