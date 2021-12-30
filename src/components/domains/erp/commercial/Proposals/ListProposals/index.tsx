import * as proposals from '@/domains/erp/commercial/Proposals'
import * as blocks from '@/blocks'

export default function List() {
  const { proposalsData } = proposals.useList()
  return proposalsData ? (
    <blocks.Table
      colection={proposalsData}
      columnTitles={[
        {
          title: 'Tipo de pagamento',
          fieldName: 'Comentario',
          type: 'relationship',
          relationshipName: 'TipoDePagamento'
        },
        {
          title: 'Tipo de recorrência',
          fieldName: 'Comentario',
          type: 'relationship',
          relationshipName: 'TipoDeRecorrencia'
        },
        {
          title: 'Usuário',
          fieldName: 'Usuario',
          type: 'handler',
          handler: (user) => {
            if (user.Cliente !== null) {
              return user.Cliente?.Pessoa.Nome
            }
            return user.Colaborador?.Pessoa.Nome
          }
        },
        {
          title: 'Situação',
          fieldName: 'Comentario',
          type: 'relationship',
          relationshipName: 'Situacao'
        }
      ]}
      actions={proposals.RowActions}
    />
  ) : (
    <blocks.TableSkeleton />
  )
}
