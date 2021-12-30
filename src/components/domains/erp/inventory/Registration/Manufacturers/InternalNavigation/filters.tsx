import * as manufacturers from '@/domains/erp/inventory/Registration/Manufacturers'

export function Filters() {
  const { setFilters } = manufacturers.useManufacturer()
  const filters = [
    {
      title: 'Fabricante B',
      handler: () => {
        setFilters((old) => {
          return {
            currentPage: 1,
            limit: old.limit,
            offset: 0,
            where: {
              ...old,
              Nome: { _eq: 'Fabricante B' }
            }
          }
        })
      }
    }
  ]
  return filters
}
