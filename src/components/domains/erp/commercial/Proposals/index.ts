import List from './ListProposals'
import RowActions from './ListProposals/rowActions'
import InternalNavigation from './InternalNavigation'
import Create from './Form/CreateProposal'
import CreateVehicle from './Form/CreateVehicle'
import View from './Form/ViewProposal'
import ViewVehicle from './Form/ViewVehicle'
import VehicleSkeleton from './Form/VehicleSkeleton'
import GenerateProposal from './Form/GenerateProposal'
import SlidePanel from './SlidePanel'
import CreateClient from './SlidePanel/CreateClient'
import CreateAddress from './SlidePanel/CreateAdress'
import UpdateAddress from './SlidePanel/UpdateAddress'
import { CreateContext, CreateProvider, useCreate } from './CreateContext'
import { ListContext, ListProvider, useList } from './ListContext'
import {
  ViewContext,
  ViewProvider,
  useView,
  ProposalsArray
} from './ViewContext'

export {
  List,
  RowActions,
  InternalNavigation,
  SlidePanel,
  CreateClient,
  CreateAddress,
  UpdateAddress,
  Create,
  CreateVehicle,
  CreateContext,
  CreateProvider,
  useCreate,
  ListContext,
  ListProvider,
  useList,
  View,
  ViewVehicle,
  VehicleSkeleton,
  ViewContext,
  ViewProvider,
  useView,
  GenerateProposal
}
export type { ProposalsArray }
