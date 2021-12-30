import { GraphQLTypes } from 'graphql/generated/zeus'
import * as table from '@/blocks/Table/itens'
import * as icons from '@/common/Icons'
import * as operators from '@/domains/erp/production/identifiable/Chips/Operators'
import { notification } from 'utils/notification'

export default function rowActions({
  item
}: {
  item: GraphQLTypes['Operadoras']
}) {
  const { operatorsRefetch, softDeleteOperator, setSlidePanelState } =
    operators.useOperator()
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
        await softDeleteOperator({
          variables: { Id: item.Id }
        })
          .then(() => {
            operatorsRefetch()
            notification(item.Nome + ' excluido com sucesso', 'success')
          })
          .catch((err) => {
            notification(err.message, 'error')
          })
      },
      icon: <icons.DeleteIcon />
    }
  ]
  return <table.ActionsRow actions={actions} data-testid="acoesPorRegistro" />
}
