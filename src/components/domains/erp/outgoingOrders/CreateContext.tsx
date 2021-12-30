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
  createOutgoingOrder: (
    options?: MutationFunctionOptions<
      {
        insert_pedidosDeSaida_Pedidos_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createOutgoingOrderLoading: boolean
}

type ProviderProps = {
  children: ReactNode
}

export const CreateContext = createContext<CreateContextProps>(
  {} as CreateContextProps
)

export const CreateProvider = ({ children }: ProviderProps) => {
  const [createOutgoingOrder, { loading: createOutgoingOrderLoading }] =
    useTypedMutation({
      insert_pedidosDeSaida_Pedidos_one: [
        {
          object: {
            DataAbertura: new Date(),
            Solicitante_Id: 'a5b88863-85ed-4d08-bd8f-ecddd59cee8d',
            Produtos: {
              data: $`data`
            },
            Situacao_Id: 'aberto'
          }
        },
        { Id: true }
      ]
    })

  return (
    <CreateContext.Provider
      value={{
        createOutgoingOrder,
        createOutgoingOrderLoading
      }}
    >
      {children}
    </CreateContext.Provider>
  )
}

export const useCreate = () => {
  return useContext(CreateContext)
}
