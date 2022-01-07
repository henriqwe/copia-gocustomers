import * as blocks from '@/blocks'
import * as localizations from '@/domains/erp/monitoring/Localization'

export default function SlidePanel() {
  const { slidePanelState, setSlidePanelState } =
    localizations.useLocalization()
  return (
    <blocks.Modal
      title={'Histórico'}
      open={slidePanelState.open}
      handler={setSlidePanelState}
      formContent={<localizations.HistoricLocalization />}
      chevronDoubleRightIcon
      noOverlay
    />
  )
}
