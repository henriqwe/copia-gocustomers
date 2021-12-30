import * as blocks from '@/blocks'
import * as proposals from '@/domains/erp/commercial/Proposals'

export default function SlidePanel() {
  const { slidePanelState, setSlidePanelState } = proposals.useView()
  let formContent = <div />
  let title = ''
  switch (slidePanelState.type) {
    case 'createAddress':
      formContent = <proposals.CreateAddress />
      title = 'Definição de endereço'
      break
    case 'updateAddress':
      formContent = <proposals.UpdateAddress />
      title = 'Redefinição de endereço'
      break
    case 'createClient':
      formContent = <proposals.CreateClient />
      title = 'Cadastro de cliente'
      break
  }
  return (
    <blocks.Modal
      title={title}
      open={slidePanelState.open}
      handler={setSlidePanelState}
      formContent={formContent}
    />
  )
}
