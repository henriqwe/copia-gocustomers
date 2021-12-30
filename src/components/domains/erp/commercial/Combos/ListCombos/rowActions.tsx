import { GraphQLTypes } from 'graphql/generated/zeus'
import * as table from '@/blocks/Table/itens'
import * as icons from '@/common/Icons'
import * as combos from '@/domains/erp/commercial/Combos'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'
import rotas from '@/domains/routes'

export default function RowActions({
  item
}: {
  item: GraphQLTypes['comercial_Combos']
}) {
  const { combosRefetch, softDeleteCombo } = combos.useList()
  const actions = [
    {
      title: 'Vizualizar',
      url: rotas.erp.comercial.combos.index + '/' + item.Id,
      icon: <icons.ViewIcon />
    },
    {
      title: 'Deletar',
      handler: async () => {
        event?.preventDefault()
        await softDeleteCombo({
          variables: {
            Id: item.Id
          }
        })
          .then(() => {
            combosRefetch()
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
