import * as blocks from '@/blocks'
import * as services from '@/domains/erp/identities/Providers/Tabs/Services'
import { BRLMoneyFormat } from 'utils/formaters'

export default function List() {
  const { commercialServicesData } = services.useService()
  return commercialServicesData ? (
    <>
      <blocks.Table
        colection={commercialServicesData}
        columnTitles={[
          {
            title: 'Nome',
            fieldName: 'Nome'
          },
          {
            title: 'Valor',
            fieldName: 'PrestadoresDeServicos',
            type: 'handler',
            handler: (value) => {
              if (value.length === 0 || value[0].deleted_at !== null) {
                return ''
              }
              value = value[0].Valor
              return BRLMoneyFormat(value)
            }
          }
        ]}
        actions={services.RowActions}
      />
      <services.SlidePanel />
    </>
  ) : (
    <blocks.TableSkeleton />
  )
}
