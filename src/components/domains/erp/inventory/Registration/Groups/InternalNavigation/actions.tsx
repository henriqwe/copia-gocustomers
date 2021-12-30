import * as groups from '@/domains/erp/inventory/Registration/Groups'

export function Actions() {
  const { setSlidePanelState } = groups.useGroup()
  const actions = [
    {
      title: 'Grupo',
      handler: () => {
        event?.preventDefault()
        setSlidePanelState({
          open: true,
          type: 'create'
        })
      }
    }
  ]
  return actions
}
