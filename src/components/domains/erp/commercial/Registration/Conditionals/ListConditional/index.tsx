import * as blocks from '@/blocks'
import * as conditionals from '@/domains/erp/commercial/Registration/Conditionals'

export default function List() {
  const { conditionalData } = conditionals.useConditional()
  return conditionalData ? (
    <blocks.Table
      colection={conditionalData}
      columnTitles={[
        { title: 'Nome', fieldName: 'Nome' },
        {
          title: 'Situação',
          fieldName: 'Comentario',
          type: 'relationship',
          relationshipName: 'Situacao'
        }
      ]}
      actions={conditionals.RowActions}
    />
  ) : (
    <blocks.TableSkeleton />
  )
}
