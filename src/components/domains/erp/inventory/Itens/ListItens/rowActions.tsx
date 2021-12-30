import { GraphQLTypes } from 'graphql/generated/zeus'

import * as itens from '@/domains/erp/inventory/Itens'
import * as table from '@/blocks/Table/itens'
import * as icons from '@/common/Icons'

import rotas from '@/domains/routes'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function RowActions({
  item
}: {
  item: GraphQLTypes['estoque_Itens']
}) {
  const { itensRefetch, softDeleteItem } = itens.useList()
  const actions = [
    {
      title: 'Editar',
      url: rotas.erp.estoque.itens.index + '/' + item.Id,
      icon: <icons.EditIcon />
    },
    {
      title: 'Deletar',
      handler: async () => {
        event?.preventDefault()
        await softDeleteItem({
          variables: { Id: item.Id }
        })
          .then(() => {
            itensRefetch()
            notification(item.Produto.Nome + ' excluido com sucesso', 'success')
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
