import * as paths from '@/domains/erp/monitoring/Path'

export function Actions() {
  const { setSlidePanelState } = paths.usePath()
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
