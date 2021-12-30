import { GraphQLTypes } from 'graphql/generated/zeus'
import * as table from '@/blocks/Table/itens'
import * as icons from '@/common/Icons'
import * as combos from '@/domains/erp/commercial/Combos/Tabs/Combos'
import * as mainCombo from '@/domains/erp/commercial/Combos'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function RowActions({
  item
}: {
  item: GraphQLTypes['comercial_Combos_Combos']
}) {
  const {
    dependenciesCombosRefetch,
    softDeleteDependenceCombo,
    setSlidePanelState
  } = combos.useDependenceCombo()
  const { comboRefetch } = mainCombo.useView()
  const actions = [
    {
      title: 'Editar',
      handler: async () => {
        setSlidePanelState({ open: true, data: item, type: 'update' })
        event?.preventDefault()
      },
      icon: <icons.EditIcon />
    },
    {
      title: 'Deletar',
      handler: async () => {
        event?.preventDefault()
        await softDeleteDependenceCombo({
          variables: {
            Id: item.Id
          }
        })
          .then(() => {
            dependenciesCombosRefetch()
            comboRefetch()
            notification(item.Combo.Nome + ' excluido com sucesso', 'success')
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
