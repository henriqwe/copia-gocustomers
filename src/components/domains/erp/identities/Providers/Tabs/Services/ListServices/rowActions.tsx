import { GraphQLTypes } from 'graphql/generated/zeus'
import * as table from '@/blocks/Table/itens'
import * as icons from '@/common/Icons'
import * as services from '@/domains/erp/identities/Providers/Tabs/Services'

export default function RowActions({
  item
}: {
  item: GraphQLTypes['comercial_Servicos']
}) {
  const { setSlidePanelState } = services.useService()
  let actions = [
    {
      title: 'Ativar',
      handler: async () => {
        event?.preventDefault()
        setSlidePanelState({ open: true, data: item, type: 'create' })
      },
      icon: <icons.ConfigIcon />
    }
  ]
  if (item.PrestadoresDeServicos.length > 0) {
    if (item.PrestadoresDeServicos[0].deleted_at === null) {
      actions = [
        {
          title: 'Ativo',
          handler: async () => {
            event?.preventDefault()
          },
          icon: <icons.AuthorizationIcon />
        },
        {
          title: 'Editar',
          handler: async () => {
            event?.preventDefault()
            setSlidePanelState({ open: true, data: item, type: 'disable' })
          },
          icon: <icons.EditIcon />
        }
      ]
    }
  }
  return <table.ActionsRow actions={actions} data-testid="acoesPorRegistro" />
}
