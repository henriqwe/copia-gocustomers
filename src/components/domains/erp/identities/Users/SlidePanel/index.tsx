import * as blocks from '@/blocks'
import * as users from '@/domains/erp/identities/Users'

export default function SlidePanel() {
  const { slidePanelState, setSlidePanelState } = users.useUser()
  return (
    <blocks.Modal
      title={
        slidePanelState.type === 'create'
          ? 'Cadastrar Usuário'
          : 'Editar Usuário'
      }
      open={slidePanelState.open}
      handler={setSlidePanelState}
      formContent={
        slidePanelState.type === 'create' ? <users.Create /> : <users.Update />
      }
    />
  )
}
