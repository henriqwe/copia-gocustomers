import * as addressingTypes from '@/domains/erp/inventory/Registration/Addresses/AddressingTypes'

export function Actions() {
  const { setSlidePanelState } = addressingTypes.useAddressingType()
  const actions = [
    {
      title: 'Tipo de Endereçamento',
      handler: () => {
        event?.preventDefault()
        setSlidePanelState({ open: true, type: 'create' })
      }
    }
  ]
  return actions
}
