import rotas from '@/domains/routes'
import * as table from '@/blocks/Table/itens'
import * as icons from '@/common/Icons'
import { GraphQLTypes } from 'graphql/generated/zeus'

export default function RowActions({
  item
}: {
  item: GraphQLTypes['pedidosDeSaida_Pedidos']
}) {
  const actions = [
    {
      title: 'Registrar saida',
      url: rotas.erp.estoque.movimentacoes.saidas.index + '/' + item.Id,
      icon: <icons.MoveIcon />
    }
  ]
  return <table.ActionsRow actions={actions} data-testid="acoesPorRegistro" />
}
