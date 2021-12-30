import * as blocks from '@/blocks'
import * as sellers from '@/domains/erp/identities/Providers/Tabs/Sellers'

export default function SlidePanel() {
  const { slidePanelState, setSlidePanelState } = sellers.useSeller()
  return (
    <blocks.Modal
      title={
        slidePanelState.type === 'create'
          ? 'Cadastrar vendedor'
          : 'Editar vendedor'
      }
      open={slidePanelState.open}
      handler={setSlidePanelState}
      formContent={
        slidePanelState.type === 'create' ? (
          <sellers.Create />
        ) : (
          <sellers.Update />
        )
      }
    />
  )
}
