import { useGroup } from '../GroupContext'
import * as groups from '..'
import * as blocks from '@/blocks'

export default function SlidePanel() {
  const { setSlidePanelState, slidePanelState } = useGroup()
  return (
    <blocks.Modal
      title={
        slidePanelState.type === 'create' ? 'Cadastrar Grupo' : 'Editar Grupo'
      }
      open={slidePanelState.open}
      handler={setSlidePanelState}
      formContent={
        slidePanelState.type === 'create' ? (
          <groups.Create />
        ) : (
          <groups.Update />
        )
      }
    />
  )
}
