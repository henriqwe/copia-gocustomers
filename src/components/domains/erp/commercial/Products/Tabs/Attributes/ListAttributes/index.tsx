import * as common from '@/common'
import * as blocks from '@/blocks'
import * as buttons from '@/common/Buttons'
import * as attributes from '@/domains/erp/commercial/Products/Tabs/Attributes'
export default function List() {
  const { setSlidePanelState, attributesData } = attributes.useAttribute()

  return attributesData ? (
    <div>
      <div className="flex justify-end w-full gap-4 mt-5">
        <buttons.SecondaryButton
          handler={() => {
            setSlidePanelState({
              open: true
            })
          }}
        />
      </div>
      <common.Separator />
      <blocks.Table
        colection={attributesData}
        columnTitles={[
          {
            title: 'Atributo',
            fieldName: 'Nome',
            type: 'relationship',
            relationshipName: 'Atributo'
          }
        ]}
        actions={attributes.RowActions}
      />

      <attributes.SlidePanel />
    </div>
  ) : (
    <blocks.TableSkeleton />
  )
}
