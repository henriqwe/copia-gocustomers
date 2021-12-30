import * as blocks from '@/blocks'
import * as providers from '@/domains/erp/commercial/Providers'

export default function SlidePanel() {
  const { slidePanelState, setSlidePanelState } = providers.useProvider()
  return (
    <blocks.Modal
      title={'Cadastrar Parceiro'}
      open={slidePanelState.open}
      handler={setSlidePanelState}
      formContent={<providers.Create />}
    />
  )
}
