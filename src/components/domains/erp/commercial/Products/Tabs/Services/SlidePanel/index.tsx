import * as blocks from '@/blocks'
import * as services from '@/domains/erp/commercial/Products/Tabs/Services'

export default function SlidePanel() {
  const { slidePanelState, setSlidePanelState } = services.useService()
  return (
    <blocks.Modal
      title={'Cadastrar Serviço'}
      open={slidePanelState.open}
      handler={setSlidePanelState}
      formContent={<services.Create />}
    />
  )
}
