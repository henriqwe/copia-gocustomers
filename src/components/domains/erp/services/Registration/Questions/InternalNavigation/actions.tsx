import * as questions from '@/domains/erp/services/Registration/Questions'

export function Actions() {
  const { setSlidePanelState } = questions.useQuestion()
  const actions = [
    {
      title: 'Pergunta',
      handler: () => {
        event?.preventDefault()
        setSlidePanelState({ open: true, type: 'create' })
      }
    }
  ]
  return actions
}
