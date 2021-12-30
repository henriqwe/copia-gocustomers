import * as blocks from '@/blocks'
import * as contracts from '@/domains/erp/commercial/Contracts'

export default function SlidePanel() {
  const { slidePanelState, setSlidePanelState } = contracts.useContract()
  return (
    <blocks.Modal
      title={'Cadastrar Contrato'}
      open={slidePanelState.open}
      handler={setSlidePanelState}
      formContent={<contracts.Create />}
    />
  )
}
