import { GraphQLTypes } from 'graphql/generated/zeus'
import * as table from '@/blocks/Table/itens'
import * as icons from '@/common/Icons'
import * as attributes from '@/domains/erp/commercial/Services/Tabs/Attributes'
import { showError } from 'utils/showError'
import { notification } from 'utils/notification'

export default function RowActions({
  item
}: {
  item: GraphQLTypes['comercial_Servicos_Atributos']
}) {
  const { softDeleteAttribute, attributesRefetch } = attributes.useAttribute()
  const actions = [
    {
      title: 'Deletar',
      handler: async () => {
        event?.preventDefault()
        await softDeleteAttribute({
          variables: { Id: item.Id }
        })
          .then(() => {
            attributesRefetch()
            notification('Atributo excluido com sucesso', 'success')
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
