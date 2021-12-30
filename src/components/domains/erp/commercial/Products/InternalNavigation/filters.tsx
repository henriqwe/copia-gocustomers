import * as products from '@/domains/erp/commercial/Products'
export function Filters() {
  const { setFilters } = products.useProduct()
  const filters = [
    {
      title: 'Monitoramento',
      handler: () => {
        setFilters((old) => {
          return {
            currentPage: 1,
            limit: old.limit,
            offset: 0,
            where: {
              ...old.where,
              Tipo: { Comentario: { _eq: 'Monitoramento' } }
            }
          }
        })
      }
    }
  ]
  return filters
}
