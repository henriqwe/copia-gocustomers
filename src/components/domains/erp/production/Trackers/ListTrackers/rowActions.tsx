import { GraphQLTypes } from 'graphql/generated/zeus'
import * as table from '@/blocks/Table/itens'
import * as icons from '@/common/Icons'
import * as trackers from '@/domains/erp/production/Trackers'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function RowActions({
  item
}: {
  item: GraphQLTypes['producao_Rastreadores']
}) {
  const { trackersRefetch, softDeleteTracker } = trackers.useList()
  const actions = [
    {
      title: 'Deletar',
      handler: async () => {
        event?.preventDefault()
        await softDeleteTracker({
          variables: {
            Id: item.Id,
            Item_Id: item.Item.Id,
            ItemChip_Id: item.Chip.Item?.Id,
            ItemEquipamento_Id: item.Equipamento.Item.Id
          }
        })
          .then(() => {
            trackersRefetch()
            notification(
              item.CodigoReferencia + ' excluido com sucesso',
              'success'
            )
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
