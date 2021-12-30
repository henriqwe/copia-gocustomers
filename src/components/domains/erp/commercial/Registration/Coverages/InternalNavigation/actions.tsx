import * as coverages from '@/domains/erp/commercial/Registration/Coverages'

export function Actions() {
  const { setSlidePanelState } = coverages.useCoverage()
  const actions = [
    {
      title: 'Cobertura',
      handler: () => {
        event?.preventDefault()
        setSlidePanelState({ open: true, type: 'create' })
      }
    }
  ]
  return actions
}
