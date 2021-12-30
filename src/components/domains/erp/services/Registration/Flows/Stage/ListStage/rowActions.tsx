import { GraphQLTypes } from 'graphql/generated/zeus'
import * as table from '@/blocks/Table/itens'
import * as icons from '@/common/Icons'
import * as flowStages from '@/domains/erp/services/Registration/Flows/Stage'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function RowActions({
  item
}: {
  item: GraphQLTypes['atendimentos_EtapasDosFluxos']
}) {
  const { stagesRefetch, softDeleteFlowStages, setSlidePanelState } =
    flowStages.useStage()
  const actions = [
    {
      title: 'Editar',
      handler: async () => {
        event?.preventDefault()
        setSlidePanelState({ open: true, type: 'update', data: item })
      },
      icon: <icons.EditIcon />
    },
    {
      title: 'Deletar',
      handler: async () => {
        event?.preventDefault()
        await softDeleteFlowStages({
          variables: { Id: item.Id }
        })
          .then(() => {
            stagesRefetch()
            notification(item.Fluxo.Nome + ' excluido com sucesso', 'success')
          })
          .catch((err) => {
            showError(err)
          })
      },
      icon: <icons.DeleteIcon />
    }
  ]
  return <table.ActionsRow actions={actions} data-testid="acoesPorRegistro" />
}
