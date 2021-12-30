import * as produtos from '@/domains/erp/purchases/Products'
import * as blocks from '@/blocks'

export default function ListagemLogs() {
  const { logs } = produtos.useUpdate()
  return logs ? (
    <blocks.Table
      colection={logs.compras_Logs}
      columnTitles={[
        { title: 'Operação', fieldName: 'Operacao' },
        { title: 'Data', fieldName: 'created_at', type: 'date' }
      ]}
    />
  ) : (
    <blocks.TableSkeleton />
  )
}
