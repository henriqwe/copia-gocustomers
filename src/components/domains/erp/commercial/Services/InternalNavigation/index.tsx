import * as common from '@/common'
import * as service from '@/domains/erp/commercial/Services'
import { Actions } from './actions'
import { Filters } from './filters'
import { links } from './links'

const InternalNavigation = () => {
  const { filters, setFilters } = service.useService()
  return (
    <common.MainMenu
      LinkGroup={links}
      ActionsGroup={Actions()}
      FiltersGroup={Filters()}
      filters={filters}
      setFilters={setFilters}
      search={{
        field: ['Nome', 'Tipo'],
        where: (inputValue: string) => {
          return {
            _or: [
              { Nome: { _ilike: `%${inputValue}%` } },
              { Tipo: { Comentario: { _ilike: `%${inputValue}%` } } }
            ]
          }
        }
      }}
    />
  )
}

export default InternalNavigation
