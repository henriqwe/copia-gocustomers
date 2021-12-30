import * as blocks from '@/blocks'
import * as equipments from '@/domains/erp/production/identifiable/Equipments'

export default function SlideLateral() {
  const { slidePanelState, setSlidePanelState } = equipments.useEquipment()
  return (
    <blocks.Modal
      title={'Editar Equipamento'}
      open={slidePanelState.open}
      handler={setSlidePanelState}
      formContent={<equipments.Update />}
    />
  )
}
