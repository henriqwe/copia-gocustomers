import * as common from '@/common'
import { links } from '../../links'

import { Actions } from './actions'

const InternalNavigation = () => {
  return (
    <common.MainMenu
      ActionsGroup={Actions()}
      FiltersGroup={[{ title: 'test', url: '/' }]}
      LinkGroup={links}
    />
  )
}

export default InternalNavigation
