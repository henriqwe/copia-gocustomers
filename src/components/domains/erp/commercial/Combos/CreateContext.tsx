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
  createCombo: (
    options?: MutationFunctionOptions<
      {
        insert_comercial_Combos_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createComboLoading: boolean
}

type ProviderProps = {
  children: ReactNode
}

export const CreateContext = createContext<CreateContextProps>(
  {} as CreateContextProps
)

export const CreateProvider = ({ children }: ProviderProps) => {
  const [createCombo, { loading: createComboLoading }] = useTypedMutation({
    insert_comercial_Combos_one: [
      {
        object: {
          Nome: $`Nome`,
          Precos: {
            data: [{ ValorBase: $`ValorBase` }]
          },
          Planos: {
            data: $`planosData`
          },
          Produtos: {
            data: $`produtosData`
          },
          Servicos: {
            data: $`servicosData`
          }
        }
      },
      { Id: true }
    ]
  })

  return (
    <CreateContext.Provider
      value={{
        createCombo,
        createComboLoading
      }}
    >
      {children}
    </CreateContext.Provider>
  )
}

export const useCreate = () => {
  return useContext(CreateContext)
}
