import * as providers from '@/domains/erp/commercial/Providers'

export function Actions() {
  const { setSlidePanelState } = providers.useProvider()
  const actions = [
    {
      title: 'Parceiro',
      handler: () => {
        event?.preventDefault()
        setSlidePanelState({ open: true })
      }
    }
  ]
  return actions
}
