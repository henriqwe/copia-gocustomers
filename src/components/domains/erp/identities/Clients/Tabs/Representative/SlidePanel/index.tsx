import * as blocks from '@/blocks'
import * as representatives from '@/domains/erp/identities/Clients/Tabs/Representative'

export default function SlidePanel() {
  const { slidePanelState, setSlidePanelState } =
    representatives.useRepresentative()
  return (
    <blocks.Modal
      title={
        slidePanelState.type === 'create'
          ? 'Cadastro de representante'
          : 'Documentos do representante'
      }
      open={slidePanelState.open}
      handler={setSlidePanelState}
      formContent={
        slidePanelState.type === 'create' ? (
          <representatives.Create />
        ) : (
          <representatives.Update />
        )
      }
    />
  )
}
