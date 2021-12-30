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
  providerData?: {
    Id: string
    Nome: string
  }
  providerRefetch: () => void
  providerLoading: boolean
  updateProviderLoading: boolean
  updateProvider: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Fornecedores_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>

  providerSchema: yup.ObjectSchema<
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

  const [updateProvider, { loading: updateProviderLoading }] = useTypedMutation(
    {
      update_comercial_Fornecedores_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            Nome: $`Nome`,
            updated_at: new Date()
          }
        },
        { Id: true }
      ]
    }
  )

  const {
    data: providerData,
    refetch: providerRefetch,
    loading: providerLoading
  } = useTypedQuery(
    {
      comercial_Fornecedores_by_pk: [
        {
          Id: router.query.id
        },
        {
          Id: true,
          Nome: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const providerSchema = yup.object().shape({
    Nome: yup.string().required('Preencha o campo para continuar')
  })

  return (
    <UpdateContext.Provider
      value={{
        providerData: providerData?.comercial_Fornecedores_by_pk,
        providerRefetch,
        providerLoading,
        updateProviderLoading,
        updateProvider,
        providerSchema
      }}
    >
      {children}
    </UpdateContext.Provider>
  )
}

export const useUpdate = () => {
  return useContext(UpdateContext)
}
