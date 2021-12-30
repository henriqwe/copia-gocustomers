import List from './ListClients'
import RowActions from './ListClients/rowActions'
import Create from './Forms/CreateClient'
import Update from './Forms/UpdateClient'
import InternalNavigation from './InternalNavigation'
import Tabs from './Tabs'
import * as users from './Tabs/Users'
import * as Addresses from './Tabs/Addresses'
import * as Emails from './Tabs/Emails'
import * as Phones from './Tabs/Phones'
import * as Representative from './Tabs/Representative'
import * as Logs from './Tabs/LogsList'
import * as Doucments from './Tabs/Documents'

import { ListContext, ListProvider, useList } from './ListContext'

import { CreateContext, CreateProvider, useCreate } from './CreateContext'

import { UpdateContext, UpdateProvider, useUpdate } from './UpdateContext'

export {
  ListContext,
  ListProvider,
  useList,
  List,
  RowActions,
  Create,
  Update,
  InternalNavigation,
  Tabs,
  Addresses,
  Emails,
  Phones,
  Logs,
  CreateContext,
  CreateProvider,
  useCreate,
  UpdateContext,
  UpdateProvider,
  useUpdate,
  Representative,
  Doucments,
  users
}
