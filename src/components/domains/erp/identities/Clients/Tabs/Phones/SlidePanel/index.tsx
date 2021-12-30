import * as blocks from '@/blocks'
import * as phones from '@/domains/erp/identities/Clients/Tabs/Phones'

export default function SlideLateral() {
  const { slidePanelState, setSlidePanelState } = phones.usePhone()
  return (
    <blocks.Modal
      title={
        slidePanelState.type === 'create'
          ? 'Cadastrar telefone'
          : 'Editar telefone'
      }
      open={slidePanelState.open}
      handler={setSlidePanelState}
      formContent={
        slidePanelState.type === 'create' ? (
          <phones.Create />
        ) : (
          <phones.Update />
        )
      }
    />
  )
}
