import { GraphQLTypes } from 'graphql/generated/zeus'

import * as table from '@/blocks/Table/itens'
import * as addresses from '@/domains/erp/identities/Clients/Tabs/Addresses'
import * as icons from '@/common/Icons'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function RowActions({
  item
}: {
  item: GraphQLTypes['contatos_Enderecos']
}) {
  const { softDeleteAddress, addressesRefetch, setSlidePanelState } =
    addresses.useAddress()
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
        await softDeleteAddress({
          variables: {
            Id: item.Id
          }
        })
          .then(() => {
            addressesRefetch()
            notification('Endereço excluido com sucesso', 'success')
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
