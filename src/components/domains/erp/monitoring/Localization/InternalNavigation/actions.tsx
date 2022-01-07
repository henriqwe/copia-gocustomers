import * as localizations from '@/domains/erp/monitoring/Localization'

export function Actions() {
  const { setSlidePanelState } = localizations.useLocalization()
  const actions = [
    {
      title: 'Histórico',
      handler: () => {
        event?.preventDefault()
        setSlidePanelState({ open: true, type: 'create' })
      }
    }
  ]
  return actions
}
