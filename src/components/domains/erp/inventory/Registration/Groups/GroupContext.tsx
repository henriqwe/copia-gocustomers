import {
  ApolloCache,
  DefaultContext,
  FetchResult,
  MutationFunctionOptions,
  OperationVariables
} from '@apollo/client'
import { GraphQLTypes, order_by } from 'graphql/generated/zeus'
import {
  $,
  useTypedClientQuery,
  useTypedMutation,
  useTypedQuery
} from 'graphql/generated/zeus/apollo'
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState
} from 'react'
import * as yup from 'yup'

type DataReturn = Pick<
  GraphQLTypes['estoque_Grupos'],
  'Nome' | 'Descricao' | 'Id'
>

type SlidePanelStateType = {
  type: 'create' | 'update'
  data?: GraphQLTypes['estoque_Grupos'] | null
  open: boolean
}

type GroupContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  groupsData?: {
    estoque_Grupos: DataReturn[]
  }
  filteredGroups?: FilteredGroups
  filters: { limit: number; offset: number; currentPage: number; where: any }
  setFilters: Dispatch<
    SetStateAction<{
      limit: number
      offset: number
      currentPage: number
      where: any
    }>
  >

  groupsRefetch: () => void
  groupsLoading: boolean
  createGroup: (
    options?: MutationFunctionOptions<
      {
        insert_estoque_Grupos_one?: {
          Id: string
          Nome: string
          Descricao: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createGroupLoading: boolean
  softDeleteGroupLoading: boolean
  softDeleteGroup: (
    item?: MutationFunctionOptions<
      {
        update_estoque_Grupos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateGroupLoading: boolean
  updateGroup: (
    item?: MutationFunctionOptions<
      {
        update_estoque_Grupos_by_pk?: {
          Descricao: string
          Nome: string
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  groupSchema: any
}

type FilteredGroups = {
  estoque_Grupos: DataReturn[]
  estoque_Grupos_aggregate: {
    aggregate?: {
      count: number
    }
    nodes: {
      Id: string
    }[]
  }
}

type ProvedorProps = {
  children: ReactNode
}

export const GroupContext = createContext<GroupContextProps>(
  {} as GroupContextProps
)

export const GroupProvider = ({ children }: ProvedorProps) => {
  const [filters, setFilters] = useState({
    limit: 10,
    offset: 0,
    currentPage: 1,
    where: { deleted_at: { _is_null: true } }
  })
  const [filteredGroups, setFilteredGroups] = useState<FilteredGroups>()
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    type: 'create',
    open: false
  })

  const [createGroup, { loading: createGroupLoading }] = useTypedMutation({
    insert_estoque_Grupos_one: [
      {
        object: {
          Nome: $`Nome`,
          Descricao: $`Descricao`
        }
      },
      { Id: true, Nome: true, Descricao: true }
    ]
  })

  const [updateGroup, { loading: updateGroupLoading }] = useTypedMutation({
    update_estoque_Grupos_by_pk: [
      {
        pk_columns: { Id: $`Id` },
        _set: {
          Nome: $`Nome`,
          Descricao: $`Descricao`
        }
      },
      { Id: true, Nome: true, Descricao: true }
    ]
  })

  const [softDeleteGroup, { loading: softDeleteGroupLoading }] =
    useTypedMutation({
      update_estoque_Grupos_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            deleted_at: new Date()
          }
        },
        {
          Id: true
        }
      ]
    })

  const {
    data: groupsData,
    refetch: groupsRefetch,
    loading: groupsLoading
  } = useTypedQuery(
    {
      estoque_Grupos: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          Nome: true,
          Descricao: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const groupSchema = yup.object().shape({
    Nome: yup.string().required('Preencha o campo para continuar'),
    Descricao: yup.string().required('Preencha o campo para continuar')
  })

  async function getFilteredGroups() {
    const { data } = await useTypedClientQuery(
      {
        estoque_Grupos: [
          {
            order_by: [{ created_at: order_by.desc }],
            where: filters.where,
            limit: filters.limit,
            offset: filters.offset
          },
          {
            Id: true,
            Nome: true,
            Descricao: true
          }
        ],
        estoque_Grupos_aggregate: [
          {
            where: filters.where
          },
          {
            aggregate: {
              count: [{ columns: undefined, distinct: undefined }, true]
            },
            nodes: {
              Id: true
            }
          }
        ]
      },
      { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
    )
    setFilteredGroups(data)
  }

  useEffect(() => {
    getFilteredGroups()
  }, [filters, groupsData])

  return (
    <GroupContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        groupsData,
        groupsRefetch,
        groupsLoading,
        createGroup,
        createGroupLoading,
        softDeleteGroupLoading,
        softDeleteGroup,
        updateGroupLoading,
        updateGroup,
        groupSchema,
        filteredGroups,
        filters,
        setFilters
      }}
    >
      {children}
    </GroupContext.Provider>
  )
}

export const useGroup = () => {
  return useContext(GroupContext)
}
