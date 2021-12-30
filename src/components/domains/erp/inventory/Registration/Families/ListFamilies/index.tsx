import * as blocks from '@/blocks'
import * as families from '@/domains/erp/inventory/Registration/Families'

export default function List() {
  const { familiesData } = families.useFamily()
  return familiesData ? (
    <blocks.Table
      colection={familiesData.estoque_Familias}
      columnTitles={[
        { title: 'Nome', fieldName: 'Nome' },
        { title: 'Descrição', fieldName: 'Descricao' }
      ]}
      actions={families.RowActions}
    />
  ) : (
    <blocks.TableSkeleton />
  )
}
