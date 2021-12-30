import * as blocks from '@/blocks'
import * as serivceOrders from '@/domains/erp/operational/ServiceOrders'

export default function SlidePanel() {
  const { slidePanelState, setSlidePanelState } =
    serivceOrders.useServiceOrder()
  return (
    <blocks.Modal
      title={'Cadastrar Ordem de Serviço'}
      open={slidePanelState.open}
      handler={setSlidePanelState}
      formContent={<serivceOrders.Create />}
    />
  )
}
