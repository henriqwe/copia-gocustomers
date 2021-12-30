import * as blocks from '@/blocks'
import * as vehicles from '@/domains/erp/services/Vehicles'

export default function SlidePanel() {
  const { slidePanelState, setSlidePanelState } = vehicles.useVehicle()
  return (
    <blocks.Modal
      title={
        slidePanelState.type === 'create'
          ? 'Cadastrar Veículo'
          : 'Editar Veículo'
      }
      open={slidePanelState.open}
      handler={setSlidePanelState}
      formContent={
        slidePanelState.type === 'create' ? (
          <vehicles.Create />
        ) : (
          <vehicles.Update />
        )
      }
    />
  )
}
