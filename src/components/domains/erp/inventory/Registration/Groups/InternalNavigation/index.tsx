import * as common from '@/common'
import * as groups from '@/domains/erp/inventory/Registration/Groups'
import { Actions } from './actions'
import { Filters } from './filters'
import { links } from './links'

const InternalNavigation = () => {
  const { setFilters, filters } = groups.useGroup()
  return (
    <common.MainMenu
      LinkGroup={links}
      ActionsGroup={Actions()}
      FiltersGroup={Filters()}
      filters={filters}
      setFilters={setFilters}
    />
  )
}

export default InternalNavigation
