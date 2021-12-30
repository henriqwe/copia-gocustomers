import { GraphQLTypes } from 'graphql/generated/zeus'

import * as outgoingOrders from '@/domains/erp/outgoingOrders'
import * as table from '@/blocks/Table/itens'
import * as icons from '@/common/Icons'

import rotas from '@/domains/routes'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function RowActions({
  item
}: {
  item: GraphQLTypes['pedidosDeSaida_Pedidos']
}) {
  const { outGoingOrdersRefetch, softDeleteOutgoingOrder } =
    outgoingOrders.useList()
  const actions = [
    {
      title: 'Editar',
      url: rotas.erp.pedidosDeSaida.index + '/' + item.Id,
      icon: <icons.EditIcon />
    },
    {
      title: 'Deletar',
      handler: async () => {
        event?.preventDefault()
        await softDeleteOutgoingOrder({
          variables: { Id: item.Id }
        })
          .then(() => {
            outGoingOrdersRefetch()
            notification('Pedido excluido com sucesso', 'success')
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
