import { GraphQLTypes } from 'graphql/generated/zeus'
import * as table from '@/blocks/Table/itens'
import * as icons from '@/common/Icons'
import * as identifiers from '@/domains/erp/production/identifiable/Identifiers'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function RowActions({
  item
}: {
  item: GraphQLTypes['producao_Identificadores']
}) {
  const { identifiersRefetch, softDeleteIdentifier, setSlidePanelState } =
    identifiers.useIdentifier()
  const actions = [
    {
      title: 'Editar',
      handler: async () => {
        event?.preventDefault()
        setSlidePanelState({ open: true, data: item })
      },
      icon: <icons.EditIcon />
    },
    {
      title: 'Deletar',
      handler: async () => {
        event?.preventDefault()
        await softDeleteIdentifier({
          variables: { Id: item.Id }
        })
          .then(() => {
            identifiersRefetch()
            notification(
              item.CodigoIdentificador + ' excluido com sucesso',
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
