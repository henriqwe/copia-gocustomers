import * as blocks from '@/blocks'
import * as identifiers from '@/domains/erp/production/identifiable/Identifiers'

export default function List() {
  const { identifiersData } = identifiers.useIdentifier()
  return identifiersData ? (
    <blocks.Table
      colection={identifiersData}
      columnTitles={[
        { title: 'Código identificador', fieldName: 'CodigoIdentificador' }
      ]}
      actions={identifiers.RowActions}
    />
  ) : (
    <blocks.TableSkeleton />
  )
}
