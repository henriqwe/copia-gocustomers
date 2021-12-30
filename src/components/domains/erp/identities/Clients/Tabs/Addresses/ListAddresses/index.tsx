import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as blocks from '@/blocks'
import * as addresses from '@/domains/erp/identities/Clients/Tabs/Addresses'

export default function List() {
  const { setSlidePanelState, addressesData } = addresses.useAddress()
  return addressesData ? (
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
        colection={addressesData}
        columnTitles={[
          { title: 'Logradouro', fieldName: 'Logradouro' },
          { title: 'Numero', fieldName: 'Numero' }
        ]}
        actions={addresses.RowActions}
      />
      <addresses.SlidePanel />
    </div>
  ) : (
    <blocks.TableSkeleton />
  )
}
