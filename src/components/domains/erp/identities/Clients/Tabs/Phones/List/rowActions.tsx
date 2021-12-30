import { GraphQLTypes } from 'graphql/generated/zeus'

import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

import * as table from '@/blocks/Table/itens'
import * as icons from '@/common/Icons'

import * as phones from '@/domains/erp/identities/Clients/Tabs/Phones'

export default function RowActions({
  item
}: {
  item: GraphQLTypes['contatos_Telefones']
}) {
  const { softDeletePhone, phonesRefetch, setSlidePanelState } =
    phones.usePhone()
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
        await softDeletePhone({
          variables: {
            Id: item.Id
          }
        })
          .then(() => {
            phonesRefetch()
            notification('Telefone excluido com sucesso', 'success')
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
