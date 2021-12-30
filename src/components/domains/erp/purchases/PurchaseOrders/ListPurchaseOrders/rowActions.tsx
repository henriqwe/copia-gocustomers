import { GraphQLTypes } from 'graphql/generated/zeus'

import * as purchaseOrders from '@/domains/erp/purchases/PurchaseOrders'
import * as table from '@/blocks/Table/itens'
import * as icons from '@/common/Icons'

import rotas from '@/domains/routes'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function RowActions({
  item
}: {
  item: GraphQLTypes['pedidosDeCompra_Pedidos']
}) {
  const { purchaseOrderRefetch, softDeletePurchaseOrder } =
    purchaseOrders.useList()
  const actions = [
    {
      title: 'Editar',
      url: rotas.erp.compras.pedidos.index + '/' + item.Id,
      icon: <icons.EditIcon />
    },
    {
      title: 'Deletar',
      handler: async () => {
        event?.preventDefault()
        await softDeletePurchaseOrder({
          variables: { Id: item.Id }
        })
          .then(() => {
            purchaseOrderRefetch()
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
