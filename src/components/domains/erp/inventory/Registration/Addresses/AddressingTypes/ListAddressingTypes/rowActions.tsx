import { GraphQLTypes } from 'graphql/generated/zeus'
import * as table from '@/blocks/Table/itens'
import * as icons from '@/common/Icons'
import * as addressingTypes from '@/domains/erp/inventory/Registration/Addresses/AddressingTypes'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function RowActions({
  item
}: {
  item: GraphQLTypes['estoque_TiposDeEnderecamentos']
}) {
  const {
    addressingTypesRefetch,
    softDeleteAddressingType,
    setSlidePanelState
  } = addressingTypes.useAddressingType()
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
        await softDeleteAddressingType({
          variables: { Id: item.Id }
        })
          .then(() => {
            addressingTypesRefetch()
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
