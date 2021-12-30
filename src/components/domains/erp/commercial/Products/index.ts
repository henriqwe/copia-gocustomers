import List from './ListProducts'
import RowActions from './ListProducts/rowActions'
import InternalNavigation from './InternalNavigation'
import Create from './SlidePanel/CreateProduct'
import Update from './Forms/UpdateProduct'
import SlidePanel from './SlidePanel'
import Tabs from './Tabs'
import { ProductContext, ProductProvider, useProduct } from './ProductsContext'
import { UpdateContext, UpdateProvider, useUpdate } from './UpdateContext'

import * as products from './Tabs/Products'
import * as services from './Tabs/Services'
import * as upSelling from './Tabs/UpSelling'
import * as attributes from './Tabs/Attributes'

export {
  List,
  RowActions,
  InternalNavigation,
  Create,
  SlidePanel,
  Tabs,
  Update,
  ProductContext,
  ProductProvider,
  useProduct,
  UpdateContext,
  UpdateProvider,
  useUpdate,
  products,
  services,
  upSelling,
  attributes
}
