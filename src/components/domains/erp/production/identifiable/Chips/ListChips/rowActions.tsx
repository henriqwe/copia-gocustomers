import { GraphQLTypes } from 'graphql/generated/zeus'
import * as table from '@/blocks/Table/itens'
import * as icons from '@/common/Icons'
import * as chips from '@/domains/erp/production/identifiable/Chips'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function rowActions({
  item
}: {
  item: GraphQLTypes['producao_Chips']
}) {
  const { chipsRefetch, softDeleteChip, setSlidePanelState } = chips.useChips()
  const actions = [
    {
      title: 'Editar',
      handler: async () => {
        event?.preventDefault()
        setSlidePanelState({ open: true, data: item, showModal: false })
      },
      icon: <icons.EditIcon />
    },
    {
      title: 'Deletar',
      handler: async () => {
        event?.preventDefault()
        await softDeleteChip({
          variables: { Id: item.Id }
        })
          .then(() => {
            chipsRefetch()
            notification(
              item.NumeroDaLinha + ' excluido com sucesso',
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
