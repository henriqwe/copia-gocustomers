import * as common from '@/common'
import * as blocks from '@/blocks'
import * as buttons from '@/common/Buttons'
import * as combos from '@/domains/erp/commercial/Combos/Tabs/Combos'
import { BRLMoneyFormat } from 'utils/formaters'

export default function List() {
  const { dependenciesCombosData, setSlidePanelState } =
    combos.useDependenceCombo()
  return dependenciesCombosData ? (
    <>
      <div className="flex justify-end w-full gap-4 mt-5">
        <buttons.SecondaryButton
          handler={() => {
            setSlidePanelState({
              open: true,
              type: 'create'
            })
          }}
        />
      </div>
      <common.Separator />
      <blocks.Table
        colection={dependenciesCombosData}
        columnTitles={[
          {
            title: 'Combo',
            fieldName: 'Nome',
            type: 'relationship',
            relationshipName: 'Combo'
          },
          {
            title: 'Valor',
            fieldName: 'Valor',
            type: 'handler',
            handler: (value) => BRLMoneyFormat(value)
          }
        ]}
        actions={combos.RowActions}
      />
      <combos.SlidePanel />
    </>
  ) : (
    <blocks.TableSkeleton />
  )
}
