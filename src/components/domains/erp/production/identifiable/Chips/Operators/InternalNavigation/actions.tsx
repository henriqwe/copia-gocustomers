import * as operators from '@/domains/erp/production/identifiable/Chips/Operators'

export function Actions() {
  const { setSlidePanelState } = operators.useOperator()
  const actions = [
    {
      title: 'Operadoras',
      handler: () => {
        event?.preventDefault()
        setSlidePanelState({ open: true, type: 'create' })
      }
    }
  ]
  return actions
}
