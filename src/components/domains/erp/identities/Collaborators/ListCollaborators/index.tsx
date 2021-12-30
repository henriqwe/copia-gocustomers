import * as blocks from '@/blocks'
import * as collaborator from '@/domains/erp/identities/Collaborators'

export default function List() {
  const { collaboratorsData } = collaborator.useCollaborator()
  return collaboratorsData ? (
    <blocks.Table
      colection={collaboratorsData}
      columnTitles={[
        {
          title: 'Identificador',
          fieldName: 'Identificador',
          type: 'relationship',
          relationshipName: 'Pessoa'
        },
        {
          title: 'Colaborador',
          fieldName: 'Nome',
          type: 'relationship',
          relationshipName: 'Pessoa'
        }
      ]}
      actions={collaborator.RowActions}
    />
  ) : (
    <blocks.TableSkeleton />
  )
}
