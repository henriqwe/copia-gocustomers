import * as blocks from '@/blocks'
import * as addresses from '@/domains/erp/identities/Clients/Tabs/Addresses'

export default function SlidePanel() {
  const { slidePanelState, setSlidePanelState } = addresses.useAddress()
  return (
    <blocks.Modal
      title={
        slidePanelState.type === 'create'
          ? 'Cadastrar endereço'
          : 'Editar endereço'
      }
      open={slidePanelState.open}
      handler={setSlidePanelState}
      formContent={
        slidePanelState.type === 'create' ? (
          <addresses.Create />
        ) : (
          <addresses.Update />
        )
      }
    />
  )
}
