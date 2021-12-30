import * as exits from '@/domains/erp/inventory/Moves/Exits'
import * as blocks from '@/blocks'

export default function List() {
  const { outgoingOrdersData } = exits.useList()
  return outgoingOrdersData ? (
    <blocks.Table
      colection={outgoingOrdersData}
      columnTitles={[
        {
          title: 'Situação',
          fieldName: 'Comentario',
          type: 'relationship',
          relationshipName: 'Situacao'
        },
        { title: 'Solicitante', fieldName: 'Solicitante_Id' }
      ]}
      actions={exits.RowActions}
    />
  ) : (
    <blocks.TableSkeleton />
  )
}
