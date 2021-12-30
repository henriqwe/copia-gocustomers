import * as blocks from '@/blocks'
import * as services from '@/domains/erp/commercial/Services'

export default function List() {
  const { filteredServices, filters, setFilters } = services.useService()
  return filteredServices ? (
    <blocks.Table
      colection={filteredServices}
      search={{
        field: ['Nome', 'Tipo'],
        where: (inputValue: string) => {
          return {
            _or: [
              { Nome: { _ilike: `%${inputValue}%` } },
              { Tipo: { Comentario: { _ilike: `%${inputValue}%` } } }
            ]
          }
        }
      }}
      tableName="comercial_Servicos"
      columnTitles={[
        { title: 'Nome', fieldName: 'Nome' },
        {
          title: 'Tipo',
          fieldName: 'Comentario',
          type: 'relationship',
          relationshipName: 'Tipo'
        }
      ]}
      actions={services.RowActions}
      pagination={{ filters, setFilters }}
    />
  ) : (
    <blocks.TableSkeleton />
  )
}
