import * as blocks from '@/blocks'
import * as addresses from '@/domains/erp/inventory/Registration/Addresses'

export default function SlidePanel() {
  const { slidePanelState, setSlidePanelState } = addresses.useAddressing()
  return (
    <blocks.Modal
      title={
        slidePanelState.type === 'create'
          ? 'Cadastrar Endereçamento'
          : 'Editar Endereçamento'
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
