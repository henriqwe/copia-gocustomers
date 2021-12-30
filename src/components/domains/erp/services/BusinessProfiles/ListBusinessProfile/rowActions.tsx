import { GraphQLTypes } from 'graphql/generated/zeus'
import * as table from '@/blocks/Table/itens'
import * as icons from '@/common/Icons'
import * as businessProfiles from '@/domains/erp/services/BusinessProfiles'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function rowActions({
  item
}: {
  item: GraphQLTypes['clientes_PerfisComerciais']
}) {
  const {
    businessProfilesRefetch,
    softDeleteBusinessProfile,
    setSlidePanelState
  } = businessProfiles.useBusinessProfile()
  const actions = [
    {
      title: 'Editar',
      handler: async () => {
        event?.preventDefault()
        setSlidePanelState({ open: true, data: item })
      },
      icon: <icons.EditIcon />
    },
    {
      title: 'Deletar',
      handler: async () => {
        event?.preventDefault()
        await softDeleteBusinessProfile({
          variables: {
            Lead_Id: item.Lead.Id,
            Grupo_Id: item.GrupoDePergunta.Id
          }
        })
          .then(() => {
            businessProfilesRefetch()
            notification('Perfil comercial excluido com sucesso', 'success')
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
