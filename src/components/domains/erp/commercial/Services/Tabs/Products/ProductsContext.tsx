import {
  ApolloCache,
  DefaultContext,
  FetchResult,
  MutationFunctionOptions,
  OperationVariables
} from '@apollo/client'
import { GraphQLTypes } from 'graphql/generated/zeus'
import {
  $,
  useTypedMutation,
  useTypedQuery
} from 'graphql/generated/zeus/apollo'
import { useRouter } from 'next/router'
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState
} from 'react'
import * as yup from 'yup'

type ProductContextProps = {
  listType: 'products' | 'dependents'
  setListType: Dispatch<SetStateAction<'products' | 'dependents'>>
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  dependentsProductsData?: {
    Id: string
    Produtos_Servicos: {
      Id: string
      Produto: {
        Nome: string
      }
    }[]
  }

  dependentsProductsRefetch: () => void
  dependentsProductsLoading: boolean
  mainProductsData?: {
    Id: string
    Nome: string
  }[]

  mainProductsRefetch: () => void
  mainProductsLoading: boolean
  productsData?: {
    Id: string
    Produto: {
      Nome: string
    }
  }[]

  productsRefetch: () => void
  productsLoading: boolean
  createProduct: (
    options?: MutationFunctionOptions<
      {
        insert_comercial_Servicos_Produtos_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createProductLoading: boolean
  updateProduct: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Servicos_Produtos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateProductLoading: boolean
  softDeleteProductLoading: boolean
  softDeleteProduct: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Servicos_Produtos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  productSchema: any
}

type SlidePanelStateType = {
  data?: GraphQLTypes['comercial_Servicos_Produtos'] | null
  open: boolean
}

type ProviderProps = {
  children: ReactNode
}

export const ProductContext = createContext<ProductContextProps>(
  {} as ProductContextProps
)

export const ProductProvider = ({ children }: ProviderProps) => {
  const [listType, setListType] = useState<'products' | 'dependents'>(
    'products'
  )
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    open: false
  })

  const router = useRouter()
  const [createProduct, { loading: createProductLoading }] = useTypedMutation({
    insert_comercial_Servicos_Produtos_one: [
      {
        object: {
          Servico_Id: router.query.id,
          Produto_Id: $`Produto_Id`
        }
      },
      { Id: true }
    ]
  })

  const [updateProduct, { loading: updateProductLoading }] = useTypedMutation({
    update_comercial_Servicos_Produtos_by_pk: [
      {
        pk_columns: { Id: $`Id` },
        _set: {
          Servico_Id: router.query.id,
          Produto_Id: $`Produto_Id`
        }
      },
      {
        Id: true
      }
    ]
  })

  const [softDeleteProduct, { loading: softDeleteProductLoading }] =
    useTypedMutation({
      update_comercial_Servicos_Produtos_by_pk: [
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
      comercial_Servicos_Produtos: [
        {
          order_by: [{ created_at: 'desc' }],
          where: {
            deleted_at: { _is_null: true },
            Servico_Id: { _eq: router.query.id }
          }
        },
        {
          Id: true,
          Produto: {
            Nome: true
          }
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const {
    data: mainProductsData,
    refetch: mainProductsRefetch,
    loading: mainProductsLoading
  } = useTypedQuery(
    {
      comercial_Produtos: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          Nome: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const {
    data: dependentsProductsData,
    refetch: dependentsProductsRefetch,
    loading: dependentsProductsLoading
  } = useTypedQuery(
    {
      comercial_Servicos_by_pk: [
        {
          Id: router.query.id
        },
        {
          Id: true,
          Produtos_Servicos: [
            {
              where: {
                Servico_Id: { _eq: router.query.id },
                deleted_at: { _is_null: true }
              }
            },
            { Id: true, Produto: { Nome: true } }
          ]
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const productSchema = yup.object().shape({
    Produto_Id: yup.object().required('Preencha o campo para continuar')
  })

  return (
    <ProductContext.Provider
      value={{
        listType,
        setListType,
        slidePanelState,
        setSlidePanelState,
        productsData: productsData?.comercial_Servicos_Produtos,
        productsRefetch,
        productsLoading,
        mainProductsData: mainProductsData?.comercial_Produtos,
        mainProductsRefetch,
        mainProductsLoading,
        dependentsProductsData:
          dependentsProductsData?.comercial_Servicos_by_pk,
        dependentsProductsRefetch,
        dependentsProductsLoading,
        createProduct,
        createProductLoading,
        updateProduct,
        updateProductLoading,
        softDeleteProductLoading,
        softDeleteProduct,
        productSchema
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export const useProduct = () => {
  return useContext(ProductContext)
}
