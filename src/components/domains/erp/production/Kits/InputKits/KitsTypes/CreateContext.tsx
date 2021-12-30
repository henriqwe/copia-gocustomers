import {
  ApolloCache,
  DefaultContext,
  FetchResult,
  MutationFunctionOptions,
  OperationVariables
} from '@apollo/client'
import { $, useTypedMutation } from 'graphql/generated/zeus/apollo'
import { createContext, ReactNode, useContext } from 'react'

type CreateContextProps = {
  createKitType: (
    options?: MutationFunctionOptions<
      {
        insert_producao_TiposDeKitDeInsumo_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createKitTypeLoading: boolean
}

type ProviderProps = {
  children: ReactNode
}

export const CreateContext = createContext<CreateContextProps>(
  {} as CreateContextProps
)

export const CreateProvider = ({ children }: ProviderProps) => {
  const [createKitType, { loading: createKitTypeLoading }] = useTypedMutation({
    insert_producao_TiposDeKitDeInsumo_one: [
      {
        object: {
          Nome: $`Nome`,
          Itens: {
            data: $`data`
          }
        }
      },
      { Id: true }
    ]
  })

  return (
    <CreateContext.Provider
      value={{
        createKitType,
        createKitTypeLoading
      }}
    >
      {children}
    </CreateContext.Provider>
  )
}

export const useCreate = () => {
  return useContext(CreateContext)
}
