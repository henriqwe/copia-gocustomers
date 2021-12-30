import * as common from '@/common'
import * as blocks from '@/blocks'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as services from '@/domains/erp/commercial/Products/Tabs/Services'
import { Controller, useForm } from 'react-hook-form'

export default function List() {
  const {
    servicesData,
    setSlidePanelState,
    dependentsServicesData,
    listType,
    setListType
  } = services.useService()
  const { control } = useForm()
  return servicesData ? (
    <div>
      <div className="flex justify-end w-full gap-4 mt-5">
        <Controller
          name={'listType'}
          defaultValue={{
            key: listType,
            title:
              listType === 'services'
                ? 'Serviços dependentes'
                : 'Serviços que eu dependo'
          }}
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="flex-1">
              <form.Select
                itens={[
                  { key: 'services', title: 'Serviços dependentes' },
                  { key: 'dependents', title: 'Serviços que eu dependo' }
                ]}
                value={value}
                onChange={(e) => {
                  setListType(e.key)
                  onChange(e)
                }}
                label="Listagem"
              />
            </div>
          )}
        />
        {listType === 'services' && (
          <buttons.SecondaryButton
            handler={() => {
              setSlidePanelState({
                open: true
              })
            }}
          />
        )}
      </div>
      <common.Separator />
      {listType === 'services' ? (
        <blocks.Table
          colection={servicesData}
          columnTitles={[
            {
              title: 'Nome',
              fieldName: 'Nome',
              type: 'relationship',
              relationshipName: 'Servico'
            }
          ]}
          actions={services.RowActions}
        />
      ) : (
        <blocks.Table
          colection={dependentsServicesData?.Servicos_Produtos}
          columnTitles={[
            {
              title: 'Nome',
              fieldName: 'Nome',
              type: 'relationship',
              relationshipName: 'Servico'
            }
          ]}
        />
      )}

      <services.SlidePanel />
    </div>
  ) : (
    <blocks.TableSkeleton />
  )
}
