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
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState
} from 'react'
import * as yup from 'yup'
import { AssertsShape, Assign, ObjectShape, TypeOfShape } from 'yup/lib/object'
import { RequiredStringSchema } from 'yup/lib/string'

type ProviderContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  providersData?: {
    Id: string
    Nome: string
  }[]

  providersRefetch: () => void
  providersLoading: boolean
  createProvider: (
    options?: MutationFunctionOptions<
      {
        insert_comercial_Fornecedores_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createProviderLoading: boolean
  softDeleteProviderLoading: boolean
  softDeleteProvider: (
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

type SlidePanelStateType = {
  data?: GraphQLTypes['comercial_Fornecedores'] | null
  open: boolean
}

export const ProviderContext = createContext<ProviderContextProps>(
  {} as ProviderContextProps
)

export const ProviderProvider = ({ children }: ProviderProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    open: false
  })

  const [createProvider, { loading: createProviderLoading }] = useTypedMutation(
    {
      insert_comercial_Fornecedores_one: [
        {
          object: {
            Nome: $`Nome`
          }
        },
        { Id: true }
      ]
    }
  )

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

  const [softDeleteProvider, { loading: softDeleteProviderLoading }] =
    useTypedMutation({
      update_comercial_Fornecedores_by_pk: [
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
    data: providersData,
    refetch: providersRefetch,
    loading: providersLoading
  } = useTypedQuery(
    {
      comercial_Fornecedores: [
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

  const providerSchema = yup.object().shape({
    Nome: yup.string().required('Preencha o campo para continuar')
  })

  return (
    <ProviderContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        providersData: providersData?.comercial_Fornecedores,
        providersRefetch,
        providersLoading,
        createProvider,
        createProviderLoading,
        softDeleteProviderLoading,
        softDeleteProvider,
        updateProviderLoading,
        updateProvider,
        providerSchema
      }}
    >
      {children}
    </ProviderContext.Provider>
  )
}

export const useProvider = () => {
  return useContext(ProviderContext)
}
