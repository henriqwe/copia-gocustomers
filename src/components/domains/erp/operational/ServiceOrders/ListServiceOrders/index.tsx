import * as blocks from '@/blocks'
import * as serviceOrders from '@/domains/erp/operational/ServiceOrders'

export default function List() {
  const { serviceOrdersData } = serviceOrders.useServiceOrder()
  return serviceOrdersData ? (
    <blocks.Table
      colection={serviceOrdersData}
      columnTitles={[
        { title: 'Código Identificador', fieldName: 'CodigoIdentificador' },
        {
          title: 'Tipo',
          fieldName: 'Comentario',
          type: 'relationship',
          relationshipName: 'Tipo'
        },
        {
          title: 'Situação',
          fieldName: 'Comentario',
          type: 'relationship',
          relationshipName: 'Situacao'
        }
      ]}
      actions={serviceOrders.RowActions}
    />
  ) : (
    <blocks.TableSkeleton />
  )
}
