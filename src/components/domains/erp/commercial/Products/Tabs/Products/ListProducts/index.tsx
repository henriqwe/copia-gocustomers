import * as common from '@/common'
import * as blocks from '@/blocks'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as products from '@/domains/erp/commercial/Products/Tabs/Products'
import { Controller, useForm } from 'react-hook-form'

export default function List() {
  const {
    productsData,
    setSlidePanelState,
    dependentsProductsData,
    listType,
    setListType
  } = products.useProduct()
  const { control } = useForm()
  return productsData ? (
    <div>
      <div className="flex justify-end w-full gap-4 mt-5">
        <Controller
          name={'listType'}
          defaultValue={{
            key: listType,
            title:
              listType === 'products'
                ? 'Produtos dependentes'
                : 'Produtos que eu dependo'
          }}
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="flex-1">
              <form.Select
                itens={[
                  { key: 'products', title: 'Produtos dependentes' },
                  { key: 'dependents', title: 'Produtos que eu dependo' }
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
        {listType === 'products' && (
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
      {listType === 'products' ? (
        <blocks.Table
          colection={productsData}
          columnTitles={[
            {
              title: 'Nome',
              fieldName: 'Nome',
              type: 'relationship',
              relationshipName: 'Produto'
            }
          ]}
          actions={products.RowActions}
        />
      ) : (
        <blocks.Table
          colection={dependentsProductsData?.ProdutosQueDependo}
          columnTitles={[
            {
              title: 'Nome',
              fieldName: 'Nome',
              type: 'relationship',
              relationshipName: 'ProdutoDependente'
            }
          ]}
        />
      )}

      <products.SlidePanel />
    </div>
  ) : (
    <blocks.TableSkeleton />
  )
}
