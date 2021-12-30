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

type ListContextProps = {
  questionsGroupsData?: {
    Id: string
    Nome: string
    Perguntas: {
      Id: string
      Pergunta: {
        Id: string
        Titulo: string
        Descricao: string
      }
    }[]
  }[]

  questionsGroupsRefetch: () => void
  questionsGroupsLoading: boolean
  softDeleteQuestionsGroupLoading: boolean
  softDeleteQuestionsGroup: (
    options?: MutationFunctionOptions<
      {
        update_vendas_GruposDePerguntas_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
}

type ProviderProps = {
  children: ReactNode
}

export const ListContext = createContext<ListContextProps>(
  {} as ListContextProps
)

export const ListProvider = ({ children }: ProviderProps) => {
  const [
    softDeleteQuestionsGroup,
    { loading: softDeleteQuestionsGroupLoading }
  ] = useTypedMutation({
    update_vendas_GruposDePerguntas_by_pk: [
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
    data: questionsGroupsData,
    refetch: questionsGroupsRefetch,
    loading: questionsGroupsLoading
  } = useTypedQuery(
    {
      vendas_GruposDePerguntas: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          Nome: true,
          Perguntas: [
            {},
            { Id: true, Pergunta: { Id: true, Titulo: true, Descricao: true } }
          ]
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  // FIXME corrigir tipo global para mutations
  return (
    <ListContext.Provider
      value={{
        questionsGroupsData: questionsGroupsData?.vendas_GruposDePerguntas,
        questionsGroupsRefetch,
        questionsGroupsLoading,
        softDeleteQuestionsGroupLoading,
        softDeleteQuestionsGroup
      }}
    >
      {children}
    </ListContext.Provider>
  )
}

export const useList = () => {
  return useContext(ListContext)
}
