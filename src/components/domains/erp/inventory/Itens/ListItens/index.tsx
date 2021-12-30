import * as itens from '@/domains/erp/inventory/Itens'
import * as blocks from '@/blocks'

export default function List() {
  const { itensData } = itens.useList()
  return itensData ? (
    <blocks.Table
      colection={itensData}
      columnTitles={[
        {
          title: 'Nome',
          fieldName: 'Nome',
          type: 'relationship',
          relationshipName: 'Produto'
        },
        {
          title: 'Fabricante',
          fieldName: 'Nome',
          type: 'relationship',
          relationshipName: 'Fabricante'
        },
        {
          title: 'Modelo',
          fieldName: 'Nome',
          type: 'relationship',
          relationshipName: 'Modelo'
        },
        { title: 'Estoque minimo', fieldName: 'EstoqueMinimo' },
        {
          title: 'Saldo',
          fieldName: 'Movimentacoes',
          type: 'handler',
          handler: (movimentacoes: { Tipo: string; Quantidade: number }[]) => {
            let saldo = 0
            movimentacoes.map((movimentacao) => {
              if (movimentacao.Tipo === 'saida') {
                saldo = saldo - movimentacao.Quantidade
                return
              }
              saldo = saldo + movimentacao.Quantidade
            })
            return saldo.toString()
          }
        }
      ]}
      actions={itens.RowActions}
    />
  ) : (
    <blocks.TableSkeleton />
  )
}
