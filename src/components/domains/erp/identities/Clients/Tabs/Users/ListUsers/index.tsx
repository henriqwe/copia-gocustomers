import * as common from '@/common'
import * as blocks from '@/blocks'
import * as buttons from '@/common/Buttons'
import * as users from '@/domains/erp/identities/Clients/Tabs/Users'

export default function List() {
  const { usersData, setSlidePanelState } = users.useUser()
  console.log(usersData)
  return usersData ? (
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
        colection={usersData}
        columnTitles={[
          {
            title: 'Email',
            fieldName: 'Email',
            type: 'handler',
            handler: (Email) => Email
          }
        ]}
        actions={users.RowActions}
      />
      <users.SlidePanel />
    </div>
  ) : (
    <blocks.TableSkeleton />
  )
}
