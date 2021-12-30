import * as blocks from '@/blocks'
import * as flows from '@/domains/erp/services/Registration/Flows'

export default function List() {
  const { flowsData } = flows.useFlow()
  return flowsData ? (
    <blocks.Table
      colection={flowsData}
      columnTitles={[{ title: 'Nome', fieldName: 'Nome' }]}
      actions={flows.RowActions}
    />
  ) : (
    <blocks.TableSkeleton />
  )
}
