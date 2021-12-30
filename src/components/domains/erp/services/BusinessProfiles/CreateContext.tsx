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
  createBusinessProfile: (
    options?: MutationFunctionOptions<
      {
        insert_clientes_PerfisComerciais?: {
          returning: {
            Id: string
          }[]
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createBusinessProfileLoading: boolean
}

type ProviderProps = {
  children: ReactNode
}

export const CreateContext = createContext<CreateContextProps>(
  {} as CreateContextProps
)

export const CreateProvider = ({ children }: ProviderProps) => {
  const [createBusinessProfile, { loading: createBusinessProfileLoading }] =
    useTypedMutation({
      insert_clientes_PerfisComerciais: [
        {
          objects: $`data`
        },
        { returning: { Id: true } }
      ]
    })

  return (
    <CreateContext.Provider
      value={{
        createBusinessProfile,
        createBusinessProfileLoading
      }}
    >
      {children}
    </CreateContext.Provider>
  )
}

export const useCreate = () => {
  return useContext(CreateContext)
}
