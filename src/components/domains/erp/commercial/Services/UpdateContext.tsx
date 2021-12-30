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
  serviceData?: {
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
  serviceRefetch: () => void
  serviceLoading: boolean
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
  updateServiceLoading: boolean
  updateService: (
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

type ProviderProps = {
  children: ReactNode
}

export const UpdateContext = createContext<UpdateContextProps>(
  {} as UpdateContextProps
)

export const UpdateProvider = ({ children }: ProviderProps) => {
  const router = useRouter()

  const [updateService, { loading: updateServiceLoading }] = useTypedMutation({
    update_comercial_Servicos_by_pk: [
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
    data: serviceData,
    refetch: serviceRefetch,
    loading: serviceLoading
  } = useTypedQuery(
    {
      comercial_Servicos_by_pk: [
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

  return (
    <UpdateContext.Provider
      value={{
        serviceData: serviceData?.comercial_Servicos_by_pk,
        serviceRefetch,
        serviceLoading,
        vehicleCategoriesData: vehicleCategoriesData?.CategoriasDeVeiculos,
        vehicleCategoriesRefetch,
        vehicleCategoriesLoading,
        serviceTypesData: serviceTypesData?.comercial_Servicos_Tipos,
        serviceTypesRefetch,
        serviceTypesLoading,
        updateServiceLoading,
        updateService,
        serviceSchema
      }}
    >
      {children}
    </UpdateContext.Provider>
  )
}

export const useUpdate = () => {
  return useContext(UpdateContext)
}
