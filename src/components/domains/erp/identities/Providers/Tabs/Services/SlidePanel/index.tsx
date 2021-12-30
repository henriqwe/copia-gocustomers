import * as blocks from '@/blocks'
import * as services from '@/domains/erp/identities/Providers/Tabs/Services'

export default function SlidePanel() {
  const { slidePanelState, setSlidePanelState } = services.useService()
  return (
    <blocks.Modal
      title={
        slidePanelState.type === 'create' ? 'Ativar Serviço' : 'Editar Serviço'
      }
      open={slidePanelState.open}
      handler={setSlidePanelState}
      formContent={
        slidePanelState.type === 'create' ? (
          <services.Create />
        ) : (
          <services.Update />
        )
      }
    />
  )
}
