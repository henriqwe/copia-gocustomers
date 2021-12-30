import { GraphQLTypes } from 'graphql/generated/zeus'

import * as table from '@/blocks/Table/itens'
import * as emails from '@/domains/erp/identities/Clients/Tabs/Emails'
import * as icons from '@/common/Icons'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function RowActions({
  item
}: {
  item: GraphQLTypes['contatos_Emails']
}) {
  const { softDeleteEmail, emailsRefetch, setSlidePanelState } =
    emails.useEmail()
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
        await softDeleteEmail({
          variables: {
            Id: item.Id
          }
        })
          .then(() => {
            emailsRefetch()
            notification('Email excluido com sucesso', 'success')
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
