import * as itens from '@/domains/erp/inventory/Itens'
import * as blocks from '@/blocks'

export default function LogsList() {
  const { logsItensData } = itens.useUpdate()
  return logsItensData ? (
    <blocks.Table
      colection={logsItensData}
      columnTitles={[
        { title: 'Operação', fieldName: 'Operacao' },
        { title: 'Data', fieldName: 'created_at', type: 'date' }
      ]}
    />
  ) : (
    <blocks.TableSkeleton />
  )
}
