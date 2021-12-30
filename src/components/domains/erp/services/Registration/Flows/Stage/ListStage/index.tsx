import * as blocks from '@/blocks'
import * as flowStages from '@/domains/erp/services/Registration/Flows/Stage'

export default function List() {
  const { stagesData } = flowStages.useStage()
  return stagesData ? (
    <blocks.Table
      colection={stagesData}
      columnTitles={[
        { title: 'Nome', fieldName: 'Nome' },
        { title: 'Posição', fieldName: 'Posicao' },
        {
          title: 'Fluxo',
          fieldName: 'Nome',
          type: 'relationship',
          relationshipName: 'Fluxo'
        }
      ]}
      actions={flowStages.RowActions}
    />
  ) : (
    <blocks.TableSkeleton />
  )
}
