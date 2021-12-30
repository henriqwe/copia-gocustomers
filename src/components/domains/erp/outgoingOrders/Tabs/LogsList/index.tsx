import * as outgoingOrders from '@/domains/erp/outgoingOrders'
import * as blocks from '@/blocks'

export default function LogsLits() {
  const { outgoingOrderLogsData } = outgoingOrders.useUpdate()
  return outgoingOrderLogsData ? (
    <blocks.Table
      colection={outgoingOrderLogsData}
      columnTitles={[
        { title: 'Operação', fieldName: 'Operacao' },
        { title: 'Data', fieldName: 'created_at', type: 'date' }
      ]}
    />
  ) : (
    <blocks.TableSkeleton />
  )
}
