import * as blocks from '@/blocks'
import * as attributes from '@/domains/erp/commercial/Services/Tabs/Attributes'

export default function SlidePanel() {
  const { slidePanelState, setSlidePanelState } = attributes.useAttribute()
  return (
    <blocks.Modal
      title={'Cadastrar Atributo'}
      open={slidePanelState.open}
      handler={setSlidePanelState}
      formContent={<attributes.Create />}
    />
  )
}
