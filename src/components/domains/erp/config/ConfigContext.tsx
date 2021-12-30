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
import { createContext, ReactNode, useContext } from 'react'

type ConfigContextProps = {
  updateConfig: (
    options?: MutationFunctionOptions<
      {
        update_Configuracoes_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateConfigLoading: boolean
  configData?: {
    Id: string
    Nome: string
    Slug: string

    Valor: any
  }[]
  configLoading: boolean
  configRefetch: () => void
}

type ProviderProps = {
  children: ReactNode
}

export const ConfigContext = createContext<ConfigContextProps>(
  {} as ConfigContextProps
)

export const ConfigProvider = ({ children }: ProviderProps) => {
  const [updateConfig, { loading: updateConfigLoading }] = useTypedMutation({
    update_Configuracoes_by_pk: [
      {
        pk_columns: { Slug: $`Slug` },
        _set: {
          Valor: $`Valor`,
          updated_at: new Date()
        }
      },
      { Id: true }
    ]
  })

  const {
    data: configData,
    loading: configLoading,
    refetch: configRefetch
  } = useTypedQuery(
    {
      Configuracoes: [
        { where: { deleted_at: { _is_null: true } } },
        {
          Id: true,
          Nome: true,
          Slug: true,
          Valor: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  return (
    <ConfigContext.Provider
      value={{
        updateConfig,
        updateConfigLoading,
        configData: configData?.Configuracoes,
        configLoading,
        configRefetch
      }}
    >
      {children}
    </ConfigContext.Provider>
  )
}

export const useConfig = () => {
  return useContext(ConfigContext)
}
