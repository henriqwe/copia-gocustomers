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
  baseContractData?: {
    Nome: string
    Id: string
    CodigoReferencia: number
    Parceiro: {
      Id: string
      Nome: string
    }
  }
  baseContractRefetch: () => void
  baseContractLoading: boolean
  updateContractLoading: boolean
  updateContract: (
    options?: MutationFunctionOptions<
      {
        update_comercial_ContratosBase_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>

  baseContractSchema: yup.ObjectSchema<
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

  const {
    data: baseContractData,
    refetch: baseContractRefetch,
    loading: baseContractLoading
  } = useTypedQuery(
    {
      comercial_ContratosBase_by_pk: [
        {
          Id: router.query.id
        },
        {
          Id: true,
          Nome: true,
          CodigoReferencia: true,
          Parceiro: {
            Id: true,
            Nome: true
          }
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const [updateContract, { loading: updateContractLoading }] = useTypedMutation(
    {
      update_comercial_ContratosBase_by_pk: [
        {
          pk_columns: {
            Id: router.query.id
          },
          _set: {
            Nome: $`Nome`,
            Parceiro_Id: $`Parceiro_Id`
          }
        },
        { Id: true }
      ]
    }
  )

  const baseContractSchema = yup.object().shape({
    Nome: yup.string().required('Preencha o campo para continuar'),
    Parceiro: yup
      .object()
      .required('Selecione pelo menos uma parceiro para continuar')
  })

  return (
    <UpdateContext.Provider
      value={{
        baseContractData: baseContractData?.comercial_ContratosBase_by_pk,
        baseContractRefetch,
        baseContractLoading,
        updateContractLoading,
        updateContract,
        baseContractSchema
      }}
    >
      {children}
    </UpdateContext.Provider>
  )
}

export const useUpdate = () => {
  return useContext(UpdateContext)
}
