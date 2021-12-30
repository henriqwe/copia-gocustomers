import * as blocks from '@/blocks'
import * as questionsGroups from '@/domains/erp/services/Registration/Questions/Groups'

export default function List() {
  const { questionsGroupsData } = questionsGroups.useList()
  return questionsGroupsData ? (
    <blocks.Table
      colection={questionsGroupsData}
      columnTitles={[{ title: 'Nome', fieldName: 'Nome' }]}
      actions={questionsGroups.RowActions}
    />
  ) : (
    <blocks.TableSkeleton />
  )
}
