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

type UpdateContextProps = {
  questionsGroupData?: {
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
  }

  questionsGroupRefetch: () => void
  questionsGroupLoading: boolean
  updateQuestionsGroupLoading: boolean
  updateQuestionsGroup: (
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
  updateQuestionsGroupQuestionLoading: boolean
  updateQuestionsGroupQuestion: (
    options?: MutationFunctionOptions<
      {
        update_vendas_GruposDePerguntas_Perguntas_by_pk?: {
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

export const UpdateContext = createContext<UpdateContextProps>(
  {} as UpdateContextProps
)

export const UpdateProvider = ({ children }: ProviderProps) => {
  const router = useRouter()
  const [updateQuestionsGroup, { loading: updateQuestionsGroupLoading }] =
    useTypedMutation({
      update_vendas_GruposDePerguntas_by_pk: [
        {
          pk_columns: { Id: router.query.id },
          _set: {
            Nome: $`Nome`,
            updated_at: new Date()
          }
        },
        { Id: true }
      ]
    })

  const [
    updateQuestionsGroupQuestion,
    { loading: updateQuestionsGroupQuestionLoading }
  ] = useTypedMutation({
    update_vendas_GruposDePerguntas_Perguntas_by_pk: [
      {
        pk_columns: { Id: $`Id` },
        _set: {
          Pergunta_Id: $`Pergunta_Id`,
          updated_at: new Date()
        }
      },
      { Id: true }
    ]
  })

  const {
    data: questionsGroupData,
    refetch: questionsGroupRefetch,
    loading: questionsGroupLoading
  } = useTypedQuery(
    {
      vendas_GruposDePerguntas_by_pk: [
        { Id: router.query.id },
        {
          Id: true,
          Nome: true,
          Perguntas: [
            {},
            { Id: true, Pergunta: { Titulo: true, Id: true, Descricao: true } }
          ]
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  return (
    <UpdateContext.Provider
      value={{
        updateQuestionsGroup,
        updateQuestionsGroupLoading,
        questionsGroupData: questionsGroupData?.vendas_GruposDePerguntas_by_pk,
        questionsGroupRefetch,
        questionsGroupLoading,
        updateQuestionsGroupQuestion,
        updateQuestionsGroupQuestionLoading
      }}
    >
      {children}
    </UpdateContext.Provider>
  )
}

export const useUpdate = () => {
  return useContext(UpdateContext)
}
