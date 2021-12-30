import List from '@/domains/erp/inventory/Registration/Groups/ListGroups'
import RowActions from '@/domains/erp/inventory/Registration/Groups/ListGroups/rowActions'
import Create from '@/domains/erp/inventory/Registration/Groups/SlidePanel/CreateGroup'
import Update from '@/domains/erp/inventory/Registration/Groups/SlidePanel/UpdateGroup'
import SlidePanel from '@/domains/erp/inventory/Registration/Groups/SlidePanel'
import InternalNavigation from '@/domains/erp/inventory/Registration/Groups/InternalNavigation'
import { GroupContext, GroupProvider, useGroup } from './GroupContext'

export {
  List,
  RowActions,
  Create,
  SlidePanel,
  Update,
  InternalNavigation,
  GroupContext,
  GroupProvider,
  useGroup
}
