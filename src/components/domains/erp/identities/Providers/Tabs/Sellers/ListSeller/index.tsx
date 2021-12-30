import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as blocks from '@/blocks'
import * as sellers from '@/domains/erp/identities/Providers/Tabs/Sellers'

export default function List() {
  const { setSlidePanelState, sellersData } = sellers.useSeller()
  return sellersData ? (
    <div>
      <div className="flex justify-end w-full mt-5">
        <buttons.SecondaryButton
          handler={() => {
            setSlidePanelState({ open: true, type: 'create' })
          }}
        />
      </div>
      <common.Separator />
      <blocks.Table
        colection={sellersData}
        columnTitles={[{ title: 'Nome', fieldName: 'Nome' }]}
        actions={sellers.RowActions}
      />
      <sellers.SlidePanel />
    </div>
  ) : (
    <blocks.TableSkeleton />
  )
}
