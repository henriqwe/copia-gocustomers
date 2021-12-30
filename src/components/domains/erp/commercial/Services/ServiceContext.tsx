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
import { AssertsShape, Assign, ObjectShape, TypeOfShape } from 'yup/lib/object'
import { RequiredStringSchema } from 'yup/lib/string'

type ServiceContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  servicesData?: Service[]
  servicesRefetch: () => void
  servicesLoading: boolean
  filteredServices?: FilteredServices
  filters: { limit: number; offset: number; currentPage: number; where: any }
  setFilters: Dispatch<
    SetStateAction<{
      limit: number
      offset: number
      currentPage: number
      where: any
    }>
  >
  vehicleCategoriesData?: {
    Id: string
    Nome: string
  }[]
  vehicleCategoriesRefetch: () => void
  vehicleCategoriesLoading: boolean
  serviceTypesData?: {
    Comentario: string
    Valor: string
  }[]
  serviceTypesRefetch: () => void
  serviceTypesLoading: boolean
  createService: (
    options?: MutationFunctionOptions<
      {
        insert_comercial_Servicos_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createServiceLoading: boolean
  softDeleteServiceLoading: boolean
  softDeleteService: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Servicos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>

  serviceSchema: yup.ObjectSchema<
    Assign<
      ObjectShape,
      {
        Nome: RequiredStringSchema<string | undefined, Record<string, string>>
      }
    >,
    Record<string, string>,
    TypeOfShape<{
      Nome: RequiredStringSchema<string | undefined, Record<string, string>>
    }>,
    AssertsShape<{
      Nome: RequiredStringSchema<string | undefined, Record<string, string>>
    }>
  >
}

type FilteredServices = {
  comercial_Servicos: Service[]
  comercial_Servicos_aggregate: {
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

type SlidePanelStateType = {
  type: 'create' | 'update'
  data?: GraphQLTypes['comercial_Servicos'] | null
  open: boolean
}

type Service = {
  Id: string
  Nome: string
  Tipo: {
    Valor: string
    Comentario: string
  }
  Categorias: {
    key: string
    title: string
  }[]
  Produtos_Servicos: {
    Id: string
    Produto: {
      Nome: string
    }
  }[]
  servicosServicos: {
    Id: string
    Servico: {
      Nome: string
    }
  }[]
  Fornecedores: {
    Id: string
    Precos: { Id: string; Valor: string }[]
  }[]
}

export const ServiceContext = createContext<ServiceContextProps>(
  {} as ServiceContextProps
)

export const ServiceProvider = ({ children }: ProviderProps) => {
  const [filters, setFilters] = useState({
    limit: 10,
    offset: 0,
    currentPage: 1,
    where: { deleted_at: { _is_null: true } }
  })
  const [filteredServices, setFilteredServices] = useState<FilteredServices>()
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    type: 'create',
    open: false
  })

  const [createService, { loading: createServiceLoading }] = useTypedMutation({
    insert_comercial_Servicos_one: [
      {
        object: {
          Nome: $`Nome`,
          Categorias: $`Categorias`,
          Tipo_Id: $`Tipo_Id`
        }
      },
      { Id: true }
    ]
  })

  const [softDeleteService, { loading: softDeleteServiceLoading }] =
    useTypedMutation({
      update_comercial_Servicos_by_pk: [
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
    data: servicesData,
    refetch: servicesRefetch,
    loading: servicesLoading
  } = useTypedQuery(
    {
      comercial_Servicos: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          Nome: true,
          Categorias: true,
          Produtos_Servicos: [
            {
              where: {
                deleted_at: { _is_null: true }
              }
            },
            { Id: true, Produto: { Nome: true } }
          ],
          servicosServicos: [
            {
              where: {
                deleted_at: { _is_null: true }
              }
            },
            {
              Id: true,
              Servico: {
                Nome: true
              }
            }
          ],
          Fornecedores: [
            {},
            {
              Id: true,
              Precos: [
                { order_by: [{ created_at: 'desc' }] },
                { Id: true, Valor: true }
              ]
            }
          ],
          Tipo: {
            Valor: true,
            Comentario: true
          }
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const {
    data: vehicleCategoriesData,
    refetch: vehicleCategoriesRefetch,
    loading: vehicleCategoriesLoading
  } = useTypedQuery(
    {
      CategoriasDeVeiculos: [
        {},
        {
          Id: true,
          Nome: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const {
    data: serviceTypesData,
    refetch: serviceTypesRefetch,
    loading: serviceTypesLoading
  } = useTypedQuery(
    {
      comercial_Servicos_Tipos: [
        {},
        {
          Comentario: true,
          Valor: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const serviceSchema = yup.object().shape({
    Nome: yup.string().required('Preencha o campo para continuar'),
    Categorias: yup
      .array()
      .min(1, 'Selecione pelo menos uma categoria para continuar')
      .required('Selecione pelo menos uma categoria para continuar'),
    Tipo: yup
      .object()
      .required('Selecione pelo menos uma categoria para continuar')
  })

  async function getFilteredServices() {
    const { data } = await useTypedClientQuery(
      {
        comercial_Servicos: [
          {
            order_by: [{ created_at: order_by.desc }],
            where: filters.where,
            limit: filters.limit,
            offset: filters.offset
          },
          {
            Id: true,
            Nome: true,
            Categorias: [{ path: undefined }, true],
            Produtos_Servicos: [
              {
                where: {
                  deleted_at: { _is_null: true }
                }
              },
              { Id: true, Produto: { Nome: true } }
            ],
            servicosServicos: [
              {
                where: {
                  deleted_at: { _is_null: true }
                }
              },
              {
                Id: true,
                Servico: {
                  Nome: true
                }
              }
            ],
            Fornecedores: [
              {},
              {
                Id: true,
                Precos: [
                  { order_by: [{ created_at: order_by.desc }] },
                  { Id: true, Valor: true }
                ]
              }
            ],
            Tipo: {
              Valor: true,
              Comentario: true
            }
          }
        ],
        comercial_Servicos_aggregate: [
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
    setFilteredServices(data)
  }

  useEffect(() => {
    getFilteredServices()
  }, [filters, servicesData])

  return (
    <ServiceContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        servicesData: servicesData?.comercial_Servicos,
        servicesRefetch,
        servicesLoading,
        vehicleCategoriesData: vehicleCategoriesData?.CategoriasDeVeiculos,
        vehicleCategoriesRefetch,
        vehicleCategoriesLoading,
        serviceTypesData: serviceTypesData?.comercial_Servicos_Tipos,
        serviceTypesRefetch,
        serviceTypesLoading,
        createService,
        createServiceLoading,
        softDeleteServiceLoading,
        softDeleteService,
        serviceSchema,
        setFilters,
        filters,
        filteredServices
      }}
    >
      {children}
    </ServiceContext.Provider>
  )
}

export const useService = () => {
  return useContext(ServiceContext)
}
