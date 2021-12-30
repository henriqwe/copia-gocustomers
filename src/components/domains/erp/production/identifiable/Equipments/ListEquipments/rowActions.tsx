import { GraphQLTypes } from 'graphql/generated/zeus'
import * as table from '@/blocks/Table/itens'
import * as icons from '@/common/Icons'
import * as equipments from '@/domains/erp/production/identifiable/Equipments'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function rowActions({
  item
}: {
  item: GraphQLTypes['producao_Equipamentos']
}) {
  const { equipmentRefetch, softDeleteEquipment, setSlidePanelState } =
    equipments.useEquipment()
  const actions = [
    {
      title: 'Editar',
      handler: async () => {
        event?.preventDefault()
        setSlidePanelState({ open: true, data: item })
      },
      icon: <icons.EditIcon />
    },
    {
      title: 'Deletar',
      handler: async () => {
        event?.preventDefault()
        await softDeleteEquipment({
          variables: { Id: item.Id }
        })
          .then(() => {
            equipmentRefetch()
            notification(item.Imei + ' excluido com sucesso', 'success')
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
