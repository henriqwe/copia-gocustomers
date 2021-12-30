import { GraphQLTypes } from 'graphql/generated/zeus'
import * as table from '@/blocks/Table/itens'
import * as icons from '@/common/Icons'
import * as services from '@/domains/erp/commercial/Services/Tabs/Services'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function RowActions({
  item
}: {
  item: GraphQLTypes['comercial_Servicos_Servicos']
}) {
  const { softDeleteService, servicesRefetch } = services.useService()
  const actions = [
    {
      title: 'Deletar',
      handler: async () => {
        event?.preventDefault()
        await softDeleteService({
          variables: { Id: item.Id }
        })
          .then(() => {
            servicesRefetch()
            notification('Produto excluido com sucesso', 'success')
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
