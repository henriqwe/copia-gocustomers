import {
  ApolloCache,
  DefaultContext,
  FetchResult,
  MutationFunctionOptions,
  OperationVariables
} from '@apollo/client'
import {
  $,
  useTypedMutation,
  useTypedQuery
} from 'graphql/generated/zeus/apollo'
import { useRouter } from 'next/router'
import { createContext, ReactNode, useContext } from 'react'
import * as yup from 'yup'
import { AssertsShape, Assign, ObjectShape, TypeOfShape } from 'yup/lib/object'
import { RequiredStringSchema } from 'yup/lib/string'

type UpdateContextProps = {
  productData?: {
    Id: string
    Nome: string
    Categorias: {
      key: string
      title: string
    }[]
    Tipo: {
      Valor: string
      Comentario: string
    }
  }
  productRefetch: () => void
  productLoading: boolean
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
  updateProductLoading: boolean
  updateProduct: (
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

export const UpdateContext = createContext<UpdateContextProps>(
  {} as UpdateContextProps
)

export const UpdateProvider = ({ children }: ProviderProps) => {
  const router = useRouter()

  const [updateProduct, { loading: updateProductLoading }] = useTypedMutation({
    update_comercial_Produtos_by_pk: [
      {
        pk_columns: { Id: $`Id` },
        _set: {
          Nome: $`Nome`,
          Categorias: $`Categorias`,
          Tipo_Id: $`Tipo_Id`,
          updated_at: new Date()
        }
      },
      { Id: true }
    ]
  })

  const {
    data: productData,
    refetch: productRefetch,
    loading: productLoading
  } = useTypedQuery(
    {
      comercial_Produtos_by_pk: [
        {
          Id: router.query.id
        },
        {
          Id: true,
          Nome: true,
          Categorias: true,
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

  return (
    <UpdateContext.Provider
      value={{
        productData: productData?.comercial_Produtos_by_pk,
        productRefetch,
        productLoading,
        vehicleCategoriesData: vehicleCategoriesData?.CategoriasDeVeiculos,
        vehicleCategoriesRefetch,
        vehicleCategoriesLoading,
        productTypesData: productTypesData?.comercial_Produtos_Tipos,
        productTypesRefetch,
        productTypesLoading,
        updateProductLoading,
        updateProduct,
        productSchema
      }}
    >
      {children}
    </UpdateContext.Provider>
  )
}

export const useUpdate = () => {
  return useContext(UpdateContext)
}
