import * as blocks from '@/blocks'
import * as upSelling from '@/domains/erp/commercial/Services/Tabs/UpSelling'

export default function SlidePanel() {
  const { slidePanelState, setSlidePanelState } = upSelling.useUpSelling()
  return (
    <blocks.Modal
      title={
        slidePanelState.type === 'create'
          ? 'Cadastrar Oportunidade'
          : 'Editar Oportunidade'
      }
      open={slidePanelState.open}
      handler={setSlidePanelState}
      formContent={
        slidePanelState.type === 'create' ? (
          <upSelling.Create />
        ) : (
          <upSelling.Update />
        )
      }
    />
  )
}
