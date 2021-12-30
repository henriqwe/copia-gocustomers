import { GraphQLTypes } from 'graphql/generated/zeus'
import * as table from '@/blocks/Table/itens'
import * as icons from '@/common/Icons'
import * as plans from '@/domains/erp/commercial/Plans'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'
import rotas from '@/domains/routes'

export default function rowActions({
  item
}: {
  item: GraphQLTypes['comercial_Planos']
}) {
  const { plansRefetch, softDeletePlan } = plans.useList()
  const actions = [
    {
      title: 'Editar',
      url: rotas.erp.comercial.planos.index + '/' + item.Id,
      icon: <icons.EditIcon />
    },
    {
      title: 'Deletar',
      handler: async () => {
        event?.preventDefault()
        await softDeletePlan({
          variables: { Id: item.Id }
        })
          .then(() => {
            plansRefetch()
            notification('Plano excluido com sucesso', 'success')
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
