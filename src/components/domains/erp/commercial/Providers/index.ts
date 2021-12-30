import List from './ListProviders'
import Tabs from './Tabs'
import RowActions from './ListProviders/rowActions'
import InternalNavigation from './InternalNavigation'
import Create from './SlidePanel/CreateProvider'
import Update from './Forms/UpdateProvider'
import SlidePanel from './SlidePanel'

import * as Products from './Tabs/Products'
import * as Services from './Tabs/Services'

import {
  ProviderContext,
  ProviderProvider,
  useProvider
} from './ProviderContext'
import { UpdateContext, UpdateProvider, useUpdate } from './UpdateContext'

export {
  List,
  Tabs,
  Products,
  Services,
  RowActions,
  InternalNavigation,
  Create,
  Update,
  SlidePanel,
  ProviderContext,
  ProviderProvider,
  useProvider,
  UpdateContext,
  UpdateProvider,
  useUpdate
}
