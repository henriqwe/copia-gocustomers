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

type ProductContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  productsData?: Product[]
  productsRefetch: () => void
  productsLoading: boolean
  filteredProducts?: FilteredManufacturers
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
  productTypesData?: {
    Comentario: string
    Valor: string
  }[]
  productTypesRefetch: () => void
  productTypesLoading: boolean
  createProduct: (
    options?: MutationFunctionOptions<
      {
        insert_comercial_Produtos_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createProductLoading: boolean
  softDeleteProductLoading: boolean
  softDeleteProduct: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Produtos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  productSchema: yup.ObjectSchema<
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

type ProviderProps = {
  children: ReactNode
}

type SlidePanelStateType = {
  data?: GraphQLTypes['comercial_Produtos'] | null
  open: boolean
}

type FilteredManufacturers = {
  comercial_Produtos: Product[]
  comercial_Produtos_aggregate: {
    aggregate?: {
      count: number
    }
    nodes: {
      Id: string
    }[]
  }
}

type Product = {
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
  ProdutosQueDependo: {
    Id: string
    ProdutoDependente: {
      Nome: string
    }
  }[]
  Servicos_Produtos: {
    Id: string
    Servico: {
      Nome: string
    }
  }[]
  Fornecedores: { Id: string; Precos: { Id: string; Valor: string }[] }[]
}

export const ProductContext = createContext<ProductContextProps>(
  {} as ProductContextProps
)

export const ProductProvider = ({ children }: ProviderProps) => {
  const [filters, setFilters] = useState({
    limit: 10,
    offset: 0,
    currentPage: 1,
    where: { deleted_at: { _is_null: true } }
  })
  const [filteredProducts, setFilteredProducts] =
    useState<FilteredManufacturers>()
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    open: false
  })

  const [createProduct, { loading: createProductLoading }] = useTypedMutation({
    insert_comercial_Produtos_one: [
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

  const [softDeleteProduct, { loading: softDeleteProductLoading }] =
    useTypedMutation({
      update_comercial_Produtos_by_pk: [
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
    data: productsData,
    refetch: productsRefetch,
    loading: productsLoading
  } = useTypedQuery(
    {
      comercial_Produtos: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          Nome: true,
          Categorias: true,
          Tipo: {
            Valor: true,
            Comentario: true
          },
          ProdutosQueDependo: [
            {
              where: {
                deleted_at: { _is_null: true }
              }
            },
            {
              Id: true,
              ProdutoDependente: { Nome: true }
            }
          ],
          Servicos_Produtos: [
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
          ]
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
    data: productTypesData,
    refetch: productTypesRefetch,
    loading: productTypesLoading
  } = useTypedQuery(
    {
      comercial_Produtos_Tipos: [
        {},
        {
          Comentario: true,
          Valor: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const productSchema = yup.object().shape({
    Nome: yup.string().required('Preencha o campo para continuar'),
    Categorias: yup
      .array()
      .min(1, 'Selecione pelo menos uma categoria para continuar')
      .required('Selecione pelo menos uma categoria para continuar'),
    Tipo: yup
      .object()
      .required('Selecione pelo menos uma categoria para continuar')
  })

  async function getFilteredProducts() {
    const { data } = await useTypedClientQuery(
      {
        comercial_Produtos: [
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
            Tipo: {
              Valor: true,
              Comentario: true
            },
            ProdutosQueDependo: [
              {
                where: {
                  deleted_at: { _is_null: true }
                }
              },
              {
                Id: true,
                ProdutoDependente: { Nome: true }
              }
            ],
            Servicos_Produtos: [
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
            ]
          }
        ],
        comercial_Produtos_aggregate: [
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
    setFilteredProducts(data)
  }

  useEffect(() => {
    getFilteredProducts()
  }, [filters, productsData])

  return (
    <ProductContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        productsData: productsData?.comercial_Produtos,
        productsRefetch,
        productsLoading,
        vehicleCategoriesData: vehicleCategoriesData?.CategoriasDeVeiculos,
        vehicleCategoriesRefetch,
        vehicleCategoriesLoading,
        productTypesData: productTypesData?.comercial_Produtos_Tipos,
        productTypesRefetch,
        productTypesLoading,
        createProduct,
        createProductLoading,
        softDeleteProductLoading,
        softDeleteProduct,
        productSchema,
        setFilters,
        filters,
        filteredProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export const useProduct = () => {
  return useContext(ProductContext)
}
