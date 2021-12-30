import * as blocks from '@/blocks'
import * as addresses from '@/domains/erp/identities/Providers/Tabs/Addresses'

export default function SlidePanel() {
  const { slidePanelState, setSlidePanelState } = addresses.useAdress()
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
