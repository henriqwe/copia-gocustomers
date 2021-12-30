import { GraphQLTypes } from 'graphql/generated/zeus'
import * as table from '@/blocks/Table/itens'
import * as icons from '@/common/Icons'
import * as contracts from '@/domains/erp/commercial/Contracts'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'
import rotas from '@/domains/routes'

export default function RowActions({
  item
}: {
  item: GraphQLTypes['comercial_ContratosBase']
}) {
  const { baseContractsRefetch, softDeleteProduct } = contracts.useContract()
  const actions = [
    {
      title: 'Editar',
      url: rotas.erp.comercial.contratos + '/' + item.Id,
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
            baseContractsRefetch()
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
