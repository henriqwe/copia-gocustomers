import * as blocks from '@/blocks'
import * as families from '@/domains/erp/inventory/Registration/Families'

export default function SlidePanel() {
  const { setSlidePanelState, slidePanelState } = families.useFamily()
  return (
    <blocks.Modal
      title={
        slidePanelState.type === 'create'
          ? 'Cadastrar Família'
          : 'Editar Família'
      }
      open={slidePanelState.open}
      handler={setSlidePanelState}
      formContent={
        slidePanelState.type === 'create' ? (
          <families.Create />
        ) : (
          <families.Update />
        )
      }
    />
  )
}
