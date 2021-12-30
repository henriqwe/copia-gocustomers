import * as common from '@/common'
import { Actions } from './actions'
import { Filters } from './filters'

export default function InternalNavigation() {
  return <common.MainMenu ActionsGroup={Actions()} FiltersGroup={Filters()} />
}
