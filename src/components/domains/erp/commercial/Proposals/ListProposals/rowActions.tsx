import { GraphQLTypes } from 'graphql/generated/zeus'
import * as table from '@/blocks/Table/itens'
import * as icons from '@/common/Icons'
import * as proposals from '@/domains/erp/commercial/Proposals'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'
import rotas from '@/domains/routes'

export default function RowActions({
  item
}: {
  item: GraphQLTypes['comercial_Propostas']
}) {
  const { proposalsRefetch, softDeleteProposal } = proposals.useList()
  const actions = [
    {
      title: 'Vizualizar',
      url: rotas.erp.comercial.propostas.index + '/' + item.Id,
      icon: <icons.ViewIcon />
    },
    {
      title: 'Deletar',
      handler: async () => {
        event?.preventDefault()
        await softDeleteProposal({
          variables: {
            Id: item.Id
          }
        })
          .then(() => {
            proposalsRefetch()
            notification('Proposta excluida com sucesso', 'success')
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
