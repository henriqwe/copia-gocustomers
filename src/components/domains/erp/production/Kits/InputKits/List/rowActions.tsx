import { GraphQLTypes } from 'graphql/generated/zeus'
import * as table from '@/blocks/Table/itens'
import * as icons from '@/common/Icons'
import * as inputKits from '@/domains/erp/production/Kits/InputKits'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'
import rotas from '@/domains/routes'

export default function RowActions({
  item
}: {
  item: GraphQLTypes['producao_KitsDeInsumo']
}) {
  const { inputKitsRefetch, softDeleteInputKit } = inputKits.useList()
  const actions = [
    {
      title: 'Devolver',
      url: rotas.erp.producao.kits.kitsDeInsumo.index + '/' + item.Id,
      icon: <icons.ReturnIcon />
    },
    {
      title: 'Deletar',
      handler: async () => {
        event?.preventDefault()

        const data = item.Itens.map((itemDoKit) => {
          return {
            Data: new Date(),
            Item_Id: itemDoKit.Item.Id,
            Valor: 0,
            Quantidade: 1,
            Tipo: 'entrada',
            Motivo_Id: 'exclusaoDeKitDeInsumo'
          }
        })
        data.push({
          Data: new Date(),
          Item_Id: item.Item.Id,
          Valor: 0,
          Quantidade: 1,
          Tipo: 'saida',
          Motivo_Id: 'exclusaoDeKitDeInsumo'
        })

        await softDeleteInputKit({
          variables: {
            Id: item.Id,
            data
          }
        })
          .then(() => {
            inputKitsRefetch()
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

  if (item.KitsDeInstalacao.length !== 0) {
    actions.pop()
  }

  return <table.ActionsRow actions={actions} data-testid="acoesPorRegistro" />
}
