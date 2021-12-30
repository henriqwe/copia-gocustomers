import { GraphQLTypes } from 'graphql/generated/zeus'

import * as table from '@/blocks/Table/itens'
import * as purchaseOrders from '@/domains/erp/purchases/PurchaseOrders'

import * as icons from '@/common/Icons'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function RowActions({
  item
}: {
  item: GraphQLTypes['pedidosDeCompra_Orcamentos']
}) {
  const { softDeleteBudget, budgetsRefetch, setSlidePanelState } =
    purchaseOrders.budgets.useBudget()
  const { purchaseOrderData } = purchaseOrders.useUpdate()
  const actions = [
    {
      title: 'Autorizar',
      handler: async () => {
        event?.preventDefault()
        if (!item.Aprovado) {
          setSlidePanelState({
            open: true,
            type: 'authorize',
            data: item,
            showModal: false
          })
        }
      },
      icon: <icons.AuthorizationIcon />
    },
    {
      title: 'Visualizar',
      handler: async () => {
        event?.preventDefault()
        setSlidePanelState({
          open: true,
          type: 'view',
          data: item,
          showModal: false
        })
      },
      icon: <icons.ViewIcon />
    },
    {
      title: 'Deletar',
      handler: async () => {
        event?.preventDefault()
        await softDeleteBudget({
          variables: {
            Id: item.Id
          }
        })
          .then(() => {
            budgetsRefetch()
            notification('Orçamento excluido com sucesso', 'success')
          })
          .catch((err) => {
            showError(err)
          })
      },
      icon: <icons.DeleteIcon />
    }
  ]
  if (purchaseOrderData?.Situacao.Comentario !== 'Aberto') {
    actions.pop()
    if (!item.Aprovado) {
      actions.shift()
    }
  }

  return <table.ActionsRow actions={actions} />
}
