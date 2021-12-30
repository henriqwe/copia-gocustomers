import * as service from '@/domains/erp/commercial/Services'
export function Filters() {
  const { setFilters } = service.useService()
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
    },
    {
      title: 'Rastreamento',
      handler: () => {
        setFilters((old) => {
          return {
            currentPage: 1,
            limit: old.limit,
            offset: 0,
            where: {
              ...old.where,
              Nome: { _eq: 'Rastreamento' }
            }
          }
        })
      }
    }
  ]
  return filters
}
