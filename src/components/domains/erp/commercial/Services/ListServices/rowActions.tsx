import { GraphQLTypes } from 'graphql/generated/zeus'
import * as table from '@/blocks/Table/itens'
import * as icons from '@/common/Icons'
import * as services from '@/domains/erp/commercial/Services'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'
import rotas from '@/domains/routes'

export default function RowActions({
  item
}: {
  item: GraphQLTypes['comercial_Servicos']
}) {
  const { servicesRefetch, softDeleteService } = services.useService()
  const actions = [
    {
      title: 'Editar',
      url: rotas.erp.comercial.servicos + '/' + item.Id,
      icon: <icons.EditIcon />
    },
    {
      title: 'Deletar',
      handler: async () => {
        event?.preventDefault()
        await softDeleteService({
          variables: { Id: item.Id }
        })
          .then(() => {
            servicesRefetch()
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
