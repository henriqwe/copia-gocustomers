import * as blocks from '@/blocks'
import * as tickets from '@/domains/erp/services/Tickets'

export default function List() {
  const { ticketsData } = tickets.useTicket()
  return ticketsData ? (
    <blocks.Table
      colection={ticketsData}
      columnTitles={[
        {
          title: 'Tipo',
          fieldName: 'Comentario',
          type: 'relationship',
          relationshipName: 'Tipo'
        },
        {
          title: 'Etapa',
          fieldName: 'Posicao',
          type: 'relationship',
          relationshipName: 'Etapa'
        },
        {
          title: 'Fluxo',
          fieldName: 'Nome',
          type: 'relationship',
          relationshipName: 'Fluxo'
        },
        {
          title: 'Usuário',
          fieldName: 'Usuario',
          type: 'handler',
          handler: (user) => user.Colaborador.Pessoa.Nome
        }
      ]}
      actions={tickets.RowActions}
    />
  ) : (
    <blocks.TableSkeleton />
  )
}
