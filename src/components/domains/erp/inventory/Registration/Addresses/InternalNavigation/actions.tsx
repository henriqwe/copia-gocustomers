import * as addresses from '@/domains/erp/inventory/Registration/Addresses'

export function Actions() {
  const { setSlidePanelState } = addresses.useAddressing()
  const actions = [
    {
      title: 'Endereçamento',
      handler: () => {
        event?.preventDefault()
        setSlidePanelState({ open: true, type: 'create' })
      }
    }
  ]
  return actions
}
