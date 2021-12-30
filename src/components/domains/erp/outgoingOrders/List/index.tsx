import * as outgoingOrders from '@/domains/erp/outgoingOrders'
import * as blocks from '@/blocks'

export default function List() {
  const { outGoingOrdersData } = outgoingOrders.useList()
  return outGoingOrdersData ? (
    <blocks.Table
      colection={outGoingOrdersData}
      columnTitles={[
        { title: 'Id', fieldName: 'Id' },
        {
          title: 'Situação',
          fieldName: 'Comentario',
          type: 'relationship',
          relationshipName: 'Situacao'
        },
        {
          title: 'Data de abertura',
          fieldName: 'DataAbertura',
          type: 'date'
        }
      ]}
      actions={outgoingOrders.rowActions}
    />
  ) : (
    <blocks.TableSkeleton />
  )
}
