import { GraphQLTypes } from 'graphql/generated/zeus'
import * as table from '@/blocks/Table/itens'
import * as icons from '@/common/Icons'
import * as kitsTypes from '@/domains/erp/production/Kits/InputKits/KitsTypes'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function RowActions({
  item
}: {
  item: GraphQLTypes['producao_TiposDeKitDeInsumo']
}) {
  const { kitsTypesRefetch, softDeleteKitType } = kitsTypes.useList()
  const actions = [
    {
      title: 'Deletar',
      handler: async () => {
        event?.preventDefault()
        await softDeleteKitType({
          variables: {
            Id: item.Id
          }
        })
          .then(() => {
            kitsTypesRefetch()
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
