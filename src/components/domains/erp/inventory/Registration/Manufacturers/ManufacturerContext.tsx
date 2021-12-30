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
  GraphQLTypes['estoque_Fabricantes'],
  'Nome' | 'Descricao' | 'Id'
>

type ManufacturersContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  manufacturersData?: DataReturn[]
  manufacturersRefetch: () => void
  manufacturersLoading: boolean
  filteredManufacturers?: filteredManufacturers
  filters: { limit: number; offset: number; currentPage: number; where: any }
  setFilters: Dispatch<
    SetStateAction<{
      limit: number
      offset: number
      currentPage: number
      where: any
    }>
  >
  createManufacturer: (
    options?: MutationFunctionOptions<
      {
        insert_estoque_Fabricantes_one?: {
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
  createManufacturerLoading: boolean
  softDeleteManufacturerLoading: boolean
  softDeleteManufacturer: (
    options?: MutationFunctionOptions<
      {
        update_estoque_Fabricantes_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateManufacturerLoading: boolean
  updateManufacturer: (
    options?: MutationFunctionOptions<
      {
        update_estoque_Fabricantes_by_pk?: {
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

  manufacturerSchema: any
}

type SlidePanelStateType = {
  type: 'create' | 'update'
  data?: GraphQLTypes['estoque_Fabricantes'] | null
  open: boolean
}

type filteredManufacturers = {
  estoque_Fabricantes: DataReturn[]
  estoque_Fabricantes_aggregate: {
    aggregate?: {
      count: number
    }
    nodes: {
      Id: string
    }[]
  }
}

type ProviderProps = {
  children: ReactNode
}

export const ManufacturerContext = createContext<ManufacturersContextProps>(
  {} as ManufacturersContextProps
)

export const ManufacturerProvider = ({ children }: ProviderProps) => {
  const [filters, setFilters] = useState({
    limit: 10,
    offset: 0,
    currentPage: 1,
    where: { deleted_at: { _is_null: true } }
  })
  const [filteredManufacturers, setFilteredManufacturers] =
    useState<filteredManufacturers>()
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    type: 'create',
    open: false
  })

  const [createManufacturer, { loading: createManufacturerLoading }] =
    useTypedMutation({
      insert_estoque_Fabricantes_one: [
        {
          object: {
            Nome: $`Nome`,
            Descricao: $`Descricao`
          }
        },
        { Id: true, Nome: true, Descricao: true }
      ]
    })

  const [updateManufacturer, { loading: updateManufacturerLoading }] =
    useTypedMutation({
      update_estoque_Fabricantes_by_pk: [
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

  const [softDeleteManufacturer, { loading: softDeleteManufacturerLoading }] =
    useTypedMutation({
      update_estoque_Fabricantes_by_pk: [
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
    data: manufacturersData,
    refetch: manufacturersRefetch,
    loading: manufacturersLoading
  } = useTypedQuery(
    {
      estoque_Fabricantes: [
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

  const manufacturerSchema = yup.object().shape({
    Nome: yup.string().required('Preencha o campo para continuar'),
    Descricao: yup.string().required('Preencha o campo para continuar')
  })

  async function getFilteredManufacturers() {
    const { data } = await useTypedClientQuery(
      {
        estoque_Fabricantes: [
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
        estoque_Fabricantes_aggregate: [
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
    setFilteredManufacturers(data)
  }

  useEffect(() => {
    getFilteredManufacturers()
  }, [filters, manufacturersData])

  return (
    <ManufacturerContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        manufacturersData: manufacturersData?.estoque_Fabricantes,
        manufacturersRefetch,
        manufacturersLoading,
        createManufacturer,
        createManufacturerLoading,
        softDeleteManufacturerLoading,
        softDeleteManufacturer,
        updateManufacturerLoading,
        updateManufacturer,
        manufacturerSchema,
        setFilters,
        filters,
        filteredManufacturers
      }}
    >
      {children}
    </ManufacturerContext.Provider>
  )
}

export const useManufacturer = () => {
  return useContext(ManufacturerContext)
}
