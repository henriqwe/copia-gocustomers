import * as action from '@/domains/erp/services/Registration/Actions'

export function Actions() {
  const { setSlidePanelState } = action.useAction()
  const actions = [
    {
      title: 'Ação',
      handler: () => {
        event?.preventDefault()
        setSlidePanelState({ open: true, type: 'create' })
      }
    }
  ]
  return actions
}
