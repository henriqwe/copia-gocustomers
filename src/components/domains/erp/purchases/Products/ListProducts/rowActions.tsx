import { GraphQLTypes } from 'graphql/generated/zeus'

import * as products from '@/domains/erp/purchases/Products'
import * as table from '@/blocks/Table/itens'
import * as icons from '@/common/Icons'

import rotas from '@/domains/routes'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function RowActions({
  item
}: {
  item: GraphQLTypes['Produtos']
}) {
  const { productsRefetch, softDeleteProduct } = products.useList()
  const actions = [
    {
      title: 'Editar',
      url: rotas.erp.compras.produtos.index + '/' + item.Id,
      icon: <icons.EditIcon />
    },
    {
      title: 'Deletar',
      handler: async () => {
        event?.preventDefault()
        await softDeleteProduct({
          variables: { Id: item.Id }
        })
          .then(() => {
            productsRefetch()
            notification(item.Nome + ' excluido com sucesso', 'success')
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
