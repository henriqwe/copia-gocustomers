import * as common from '@/common'

import { Actions } from './actions'

const InternalNavigation = () => {
  return (
    <common.MainMenu
      ActionsGroup={Actions()}
      FiltersGroup={[{ title: 'test', url: '/' }]}
    />
  )
}

export default InternalNavigation
