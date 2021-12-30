import * as blocks from '@/blocks'
import * as operators from '@/domains/erp/production/identifiable/Chips/Operators'

export default function List() {
  const { operatorsData } = operators.useOperator()
  return operatorsData ? (
    <blocks.Table
      colection={operatorsData}
      columnTitles={[
        { title: 'Nome', fieldName: 'Nome' },
        { title: 'Apn', fieldName: 'Apn' },
        { title: 'Usuario', fieldName: 'Usuario' }
      ]}
      actions={operators.RowActions}
    />
  ) : (
    <blocks.TableSkeleton />
  )
}
