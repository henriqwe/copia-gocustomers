import { GraphQLTypes } from 'graphql/generated/zeus'
import * as table from '@/blocks/Table/itens'
import * as icons from '@/common/Icons'
import * as users from '@/domains/erp/identities/Users'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function RowActions({
  item
}: {
  item: GraphQLTypes['autenticacao_Usuarios']
}) {
  const { usersRefetch, softDeleteUser, setSlidePanelState } = users.useUser()
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
        await softDeleteUser({
          variables: { Id: item.Id }
        })
          .then(() => {
            usersRefetch()
            notification(
              item.Colaborador
                ? item.Colaborador.Pessoa.Nome
                : item.Cliente.Pessoa.Nome + ' excluido com sucesso',
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
