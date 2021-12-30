import * as common from '@/common'

import { Actions } from './actions'
import { links } from './links'

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
