import * as groups from '@/domains/erp/inventory/Registration/Groups'

export function Filters() {
  const { setFilters } = groups.useGroup()
  const filters = [
    {
      title: 'Grupo 8',
      handler: () => {
        setFilters((old) => {
          return {
            currentPage: 1,
            limit: old.limit,
            offset: 0,
            where: { ...old, Nome: { _eq: 'Grupo 8' } }
          }
        })
      }
    }
  ]
  return filters
}
