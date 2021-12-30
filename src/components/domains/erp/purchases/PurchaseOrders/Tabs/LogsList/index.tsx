import * as purchaseOrders from '@/domains/erp/purchases/PurchaseOrders'
import * as blocks from '@/blocks'

export default function LogsList() {
  const { purchaseOrderLogsData } = purchaseOrders.useUpdate()
  return purchaseOrderLogsData ? (
    <blocks.Table
      colection={purchaseOrderLogsData}
      columnTitles={[
        { title: 'Operação', fieldName: 'Operacao' },
        { title: 'Data', fieldName: 'created_at', type: 'date' }
      ]}
    />
  ) : (
    <blocks.TableSkeleton />
  )
}
