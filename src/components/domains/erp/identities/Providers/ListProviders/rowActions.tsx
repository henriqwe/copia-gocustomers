import { GraphQLTypes } from 'graphql/generated/zeus'
import rotas from '@/domains/routes'

import * as table from '@/blocks/Table/itens'
import * as providers from '@/domains/erp/identities/Providers'
import * as icons from '@/common/Icons'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function RowActions({
  item
}: {
  item: GraphQLTypes['identidades_Pessoas']
}) {
  const { softDeleteProvider, providersRefetch } = providers.useList()
  const actions = [
    {
      title: 'Editar',
      url: rotas.erp.identidades.fornecedores.index + '/' + item.Id,
      icon: <icons.EditIcon />
    },
    {
      title: 'Deletar',
      handler: async () => {
        event?.preventDefault()
        await softDeleteProvider({
          variables: {
            Id: item.Id
          }
        })
          .then(() => {
            providersRefetch()
            notification(item.Nome + ' excluido com sucesso', 'success')
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
