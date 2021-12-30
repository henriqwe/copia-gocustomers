import { GraphQLTypes } from 'graphql/generated/zeus'
import * as table from '@/blocks/Table/itens'
import * as icons from '@/common/Icons'
import * as upSelling from '@/domains/erp/commercial/Products/Tabs/UpSelling'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function RowActions({
  item
}: {
  item: GraphQLTypes['comercial_Produtos_Oportunidades']
}) {
  const { softDeleteUpSelling, upSellingRefetch, setSlidePanelState } =
    upSelling.useUpSelling()
  const actions = [
    {
      title: 'Editar',
      handler: async () => {
        event?.preventDefault()
        setSlidePanelState({ open: true, type: 'update', data: item })
      },
      icon: <icons.EditIcon />
    },
    {
      title: 'Deletar',
      handler: async () => {
        event?.preventDefault()
        await softDeleteUpSelling({
          variables: { Id: item.Id }
        })
          .then(() => {
            upSellingRefetch()
            notification('Oportunidade excluida com sucesso', 'success')
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
