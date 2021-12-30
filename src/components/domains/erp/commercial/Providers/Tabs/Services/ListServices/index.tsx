import * as blocks from '@/blocks'
import * as services from '@/domains/erp/commercial/Providers/Tabs/Services'

export default function List() {
  const { servicesData } = services.useService()
  return servicesData ? (
    <>
      <blocks.Table
        colection={servicesData}
        columnTitles={[{ title: 'Nome', fieldName: 'Nome' }]}
        actions={services.RowActions}
      />
      <services.SlidePane />
    </>
  ) : (
    <blocks.TableSkeleton />
  )
}
