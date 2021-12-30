import * as inputKits from '@/domains/erp/production/Kits/InputKits'
import * as blocks from '@/blocks'

export default function List() {
  const { inputKitsData } = inputKits.useList()
  return inputKitsData ? (
    <blocks.Table
      colection={inputKitsData}
      columnTitles={[
        { title: 'Código de Referencia', fieldName: 'CodigoReferencia' },
        {
          title: 'Tipo',
          fieldName: 'Nome',
          type: 'relationship',
          relationshipName: 'TiposDeKitDeInsumo'
        },
        {
          title: 'Quantidade de itens',
          fieldName: 'Itens',
          type: 'handler',
          handler: (itens) => itens.length
        }
      ]}
      actions={inputKits.RowActions}
    />
  ) : (
    <blocks.TableSkeleton />
  )
}
