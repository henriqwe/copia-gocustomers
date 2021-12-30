import * as models from '@/domains/erp/inventory/Registration/Models'

export function Actions() {
  const { setSlidePanelState } = models.useModel()
  const actions = [
    {
      title: 'Modelo',
      handler: () => {
        event?.preventDefault()
        setSlidePanelState({ open: true, type: 'create' })
      }
    }
  ]
  return actions
}
