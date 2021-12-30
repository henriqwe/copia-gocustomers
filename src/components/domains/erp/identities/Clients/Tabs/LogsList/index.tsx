import * as blocks from '@/blocks'

import * as clients from '@/domains/erp/identities/Clients'

export default function LogsList() {
  const { clientLogsData } = clients.useUpdate()

  return clientLogsData ? (
    <blocks.Table
      colection={clientLogsData}
      columnTitles={[
        { title: 'Operação', fieldName: 'Operacao' },
        { title: 'Data', fieldName: 'created_at', type: 'date' }
      ]}
    />
  ) : (
    <blocks.TableSkeleton />
  )
}
