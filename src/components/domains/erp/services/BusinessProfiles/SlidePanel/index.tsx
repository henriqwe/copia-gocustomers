import * as blocks from '@/blocks'
import * as businessProfiles from '@/domains/erp/services/BusinessProfiles'

export default function SlidePanel() {
  const { slidePanelState, setSlidePanelState } =
    businessProfiles.useBusinessProfile()
  return (
    <blocks.Modal
      title={'Editar Perfil comercial'}
      open={slidePanelState.open}
      handler={setSlidePanelState}
      formContent={<businessProfiles.Update />}
    />
  )
}
