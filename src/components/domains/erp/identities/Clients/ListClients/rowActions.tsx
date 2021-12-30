import { GraphQLTypes } from 'graphql/generated/zeus'
import rotas from '@/domains/routes'

import * as table from '@/blocks/Table/itens'
import * as clients from '@/domains/erp/identities/Clients'
import * as icons from '@/common/Icons'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function RowActions({
  item
}: {
  item: GraphQLTypes['identidades_Clientes']
}) {
  const { softDeleteClient, clientsRefetch } = clients.useList()
  const actions = [
    {
      title: 'Editar',
      url: rotas.erp.identidades.clientes.index + '/' + item.Id,
      icon: <icons.EditIcon />
    },
    {
      title: 'Deletar',
      handler: async () => {
        event?.preventDefault()
        await softDeleteClient({
          variables: {
            Id: item.Id
          }
        })
          .then(() => {
            clientsRefetch()
            notification(item.Pessoa.Nome + ' excluido com sucesso', 'success')
          })
          .catch((err) => {
            showError(err)
          })
      },
      icon: <icons.DeleteIcon />
    }
  ]

  return <table.ActionsRow actions={actions} />
}
