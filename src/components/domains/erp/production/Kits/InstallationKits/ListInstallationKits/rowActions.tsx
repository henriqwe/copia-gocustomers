import { GraphQLTypes } from 'graphql/generated/zeus'
import * as table from '@/blocks/Table/itens'
import * as icons from '@/common/Icons'
import * as installationKits from '@/domains/erp/production/Kits/InstallationKits'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

export default function RowActions({
  item
}: {
  item: GraphQLTypes['producao_KitsDeInstalacao']
}) {
  const { installationKitsRefetch, softDeleteInstallationKit } =
    installationKits.useList()
  const actions = [
    {
      title: 'Deletar',
      handler: async () => {
        event?.preventDefault()
        await softDeleteInstallationKit({
          variables: {
            Id: item.Id,
            Item_Id: item.Item.Id,
            ItemRastreador_Id: item.Rastreador.Item?.Id,
            ItemKitDeInsumo_Id: item.KitDeInsumo.Item.Id
          }
        })
          .then(() => {
            installationKitsRefetch()
            notification(
              item.CodigoReferencia + ' excluido com sucesso',
              'success'
            )
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
