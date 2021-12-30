import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as blocks from '@/blocks'
import * as phones from '@/domains/erp/identities/Clients/Tabs/Phones'
import { phoneFormat } from 'utils/formaters'

export default function List() {
  const { setSlidePanelState, phonesData } = phones.usePhone()
  return phonesData ? (
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
        colection={phonesData}
        columnTitles={[
          {
            title: 'Telefone',
            fieldName: 'Telefone',
            type: 'handler',
            handler: (numero) => {
              return phoneFormat(numero)
            }
          },
          { title: 'Responsável', fieldName: 'NomeDoResponsavel' }
        ]}
        actions={phones.RowActions}
      />
      <phones.SlidePanel />
    </div>
  ) : (
    <blocks.TableSkeleton />
  )
}
