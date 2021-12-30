import * as collaborators from '@/domains/erp/identities/Collaborators'

export function Actions() {
  const { setSlidePanelState } = collaborators.useCollaborator()
  const actions = [
    {
      title: 'Colaborador',
      handler: () => {
        event?.preventDefault()
        setSlidePanelState({ open: true, type: 'create' })
      }
    }
  ]
  return actions
}
