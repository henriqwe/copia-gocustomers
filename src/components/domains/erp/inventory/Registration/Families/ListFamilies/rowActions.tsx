import { GraphQLTypes } from 'graphql/generated/zeus'
import * as table from '@/blocks/Table/itens'
import * as families from '@/domains/erp/inventory/Registration/Families'
import * as icons from '@/common/Icons'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function RowActions({
  item
}: {
  item: GraphQLTypes['estoque_Familias']
}) {
  const {
    familiesRefetch,
    softDeleteFamily,
    setSlidePanelState,
    parentsFamiliesRefetch
  } = families.useFamily()
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
        await softDeleteFamily({
          variables: { Id: item.Id }
        })
          .then(() => {
            familiesRefetch()
            parentsFamiliesRefetch()
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
