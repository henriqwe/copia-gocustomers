import { GraphQLTypes } from 'graphql/generated/zeus'
import * as table from '@/blocks/Table/itens'
import * as icons from '@/common/Icons'
import * as tariffs from '@/domains/erp/commercial/Services/Tabs/Tariffs'
import { showError } from 'utils/showError'
import { notification } from 'utils/notification'

export default function RowActions({
  item
}: {
  item: GraphQLTypes['comercial_Servicos_Atributos']
}) {
  const { softDeleteTariff, tariffsRefetch } = tariffs.useTariff()
  const actions = [
    {
      title: 'Deletar',
      handler: async () => {
        event?.preventDefault()
        await softDeleteTariff({
          variables: { Id: item.Id }
        })
          .then(() => {
            tariffsRefetch()
            notification('Tarifa excluida com sucesso', 'success')
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
