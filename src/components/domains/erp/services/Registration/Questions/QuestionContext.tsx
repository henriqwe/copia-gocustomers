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

type QuestionContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  questionsData?: {
    Id: string
    Titulo: string
    Descricao: string
  }[]

  questionsRefetch: () => void
  questionsLoading: boolean
  createQuestion: (
    options?: MutationFunctionOptions<
      {
        insert_vendas_Perguntas_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createQuestionLoading: boolean
  softDeleteQuestionLoading: boolean
  softDeleteQuestion: (
    options?: MutationFunctionOptions<
      {
        update_vendas_Perguntas_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateQuestionLoading: boolean
  updateQuestion: (
    options?: MutationFunctionOptions<
      {
        update_vendas_Perguntas_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>

  questionSchema: yup.ObjectSchema<
    Assign<
      ObjectShape,
      {
        Titulo: RequiredStringSchema<string | undefined, Record<string, string>>
        Descricao: RequiredStringSchema<
          string | undefined,
          Record<string, string>
        >
      }
    >,
    Record<string, string>,
    TypeOfShape<{
      Titulo: RequiredStringSchema<string | undefined, Record<string, string>>
      Descricao: RequiredStringSchema<
        string | undefined,
        Record<string, string>
      >
    }>,
    AssertsShape<{
      Titulo: RequiredStringSchema<string | undefined, Record<string, string>>
      Descricao: RequiredStringSchema<
        string | undefined,
        Record<string, string>
      >
    }>
  >
}

type ProviderProps = {
  children: ReactNode
}

type SlidePanelStateType = {
  type: 'create' | 'update'
  data?: GraphQLTypes['vendas_Perguntas'] | null
  open: boolean
}

export const QuestionContext = createContext<QuestionContextProps>(
  {} as QuestionContextProps
)

export const QuestionProvider = ({ children }: ProviderProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    type: 'create',
    open: false
  })

  const [createQuestion, { loading: createQuestionLoading }] = useTypedMutation(
    {
      insert_vendas_Perguntas_one: [
        {
          object: {
            Titulo: $`Titulo`,
            Descricao: $`Descricao`
          }
        },
        { Id: true }
      ]
    }
  )

  const [updateQuestion, { loading: updateQuestionLoading }] = useTypedMutation(
    {
      update_vendas_Perguntas_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            Titulo: $`Titulo`,
            Descricao: $`Descricao`,
            updated_at: new Date()
          }
        },
        { Id: true }
      ]
    }
  )

  const [softDeleteQuestion, { loading: softDeleteQuestionLoading }] =
    useTypedMutation({
      update_vendas_Perguntas_by_pk: [
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
    data: questionsData,
    refetch: questionsRefetch,
    loading: questionsLoading
  } = useTypedQuery(
    {
      vendas_Perguntas: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          Titulo: true,
          Descricao: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const questionSchema = yup.object().shape({
    Titulo: yup.string().required('Preencha o campo para continuar'),
    Descricao: yup.string().required('Preencha o campo para continuar')
  })

  return (
    <QuestionContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        questionsData: questionsData?.vendas_Perguntas,
        questionsRefetch,
        questionsLoading,
        createQuestion,
        createQuestionLoading,
        softDeleteQuestionLoading,
        softDeleteQuestion,
        updateQuestionLoading,
        updateQuestion,
        questionSchema
      }}
    >
      {children}
    </QuestionContext.Provider>
  )
}

export const useQuestion = () => {
  return useContext(QuestionContext)
}
