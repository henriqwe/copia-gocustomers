import { GraphQLTypes } from 'graphql/generated/zeus'
import * as table from '@/blocks/Table/itens'
import * as icons from '@/common/Icons'
import * as questionsGroups from '@/domains/erp/services/Registration/Questions/Groups'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'
import rotas from '@/domains/routes'

export default function RowActions({
  item
}: {
  item: GraphQLTypes['vendas_GruposDePerguntas']
}) {
  const { questionsGroupsRefetch, softDeleteQuestionsGroup } =
    questionsGroups.useList()
  const actions = [
    {
      title: 'Editar',
      url:
        rotas.erp.atendimento.cadastros.perguntas.grupos.index + '/' + item.Id,
      icon: <icons.EditIcon />
    },
    {
      title: 'Deletar',
      handler: async () => {
        event?.preventDefault()
        await softDeleteQuestionsGroup({
          variables: { Id: item.Id }
        })
          .then(() => {
            questionsGroupsRefetch()
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
