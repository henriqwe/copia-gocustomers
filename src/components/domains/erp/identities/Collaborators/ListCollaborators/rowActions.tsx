import rotas from '@/domains/routes'
import { GraphQLTypes } from 'graphql/generated/zeus'
import * as table from '@/blocks/Table/itens'
import * as icons from '@/common/Icons'
import * as collaborators from '@/domains/erp/identities/Collaborators'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function RowActions({
  item
}: {
  item: GraphQLTypes['identidades_Colaboradores']
}) {
  const { collaboratorsRefetch, softDeleteCollaborator } =
    collaborators.useCollaborator()
  const actions = [
    {
      title: 'Editar',
      url: rotas.erp.identidades.colaboradores + '/' + item.Id,
      icon: <icons.ViewIcon />
    },
    {
      title: 'Deletar',
      handler: async () => {
        event?.preventDefault()
        await softDeleteCollaborator({
          variables: { Id: item.Id }
        })
          .then(() => {
            collaboratorsRefetch()
            notification(item.Pessoa.Nome + ' excluido com sucesso', 'success')
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
