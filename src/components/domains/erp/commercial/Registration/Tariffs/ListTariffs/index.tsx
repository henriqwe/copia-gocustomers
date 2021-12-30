import * as blocks from '@/blocks'
import * as tariffs from '@/domains/erp/commercial/Registration/Tariffs'

export default function List() {
  const { tariffsData } = tariffs.useTariffs()
  return tariffsData ? (
    <blocks.Table
      colection={tariffsData}
      columnTitles={[{ title: 'Nome', fieldName: 'Nome' }]}
      actions={tariffs.RowActions}
    />
  ) : (
    <blocks.TableSkeleton />
  )
}
