import * as blocks from '@/blocks'
import * as attributes from '@/domains/erp/commercial/Registration/Attributes'

export default function List() {
  const { attributeData } = attributes.useAttribute()
  return attributeData ? (
    <blocks.Table
      colection={attributeData}
      columnTitles={[{ title: 'Nome', fieldName: 'Nome' }]}
      actions={attributes.RowActions}
    />
  ) : (
    <blocks.TableSkeleton />
  )
}
