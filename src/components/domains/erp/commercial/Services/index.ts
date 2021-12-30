import List from './ListServices'
import RowActions from './ListServices/rowActions'
import InternalNavigation from './InternalNavigation'
import Create from './SlidePanel/CreateService'
import Update from './Forms/UpdateService'
import SlidePanel from './SlidePanel'
import Tabs from './Tabs'
import { ServiceContext, ServiceProvider, useService } from './ServiceContext'
import { UpdateContext, UpdateProvider, useUpdate } from './UpdateContext'

import * as products from './Tabs/Products'
import * as services from './Tabs/Services'
import * as upSelling from './Tabs/UpSelling'
import * as attributes from './Tabs/Attributes'
import * as tariffs from './Tabs/Tariffs'

export {
  List,
  RowActions,
  InternalNavigation,
  Tabs,
  Create,
  SlidePanel,
  Update,
  ServiceContext,
  ServiceProvider,
  useService,
  UpdateContext,
  UpdateProvider,
  useUpdate,
  products,
  services,
  upSelling,
  attributes,
  tariffs
}
