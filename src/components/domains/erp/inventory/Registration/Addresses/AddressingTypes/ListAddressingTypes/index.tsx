import * as blocks from '@/blocks'
import * as addressingTypes from '@/domains/erp/inventory/Registration/Addresses/AddressingTypes'

export default function List() {
  const { addressingTypesData } = addressingTypes.useAddressingType()
  return addressingTypesData ? (
    <blocks.Table
      colection={addressingTypesData}
      columnTitles={[
        { title: 'Nome', fieldName: 'Nome' },
        { title: 'Descrição', fieldName: 'Descricao' },
        { title: 'Slug', fieldName: 'Slug' }
      ]}
      actions={addressingTypes.RowActions}
    />
  ) : (
    <blocks.TableSkeleton />
  )
}
