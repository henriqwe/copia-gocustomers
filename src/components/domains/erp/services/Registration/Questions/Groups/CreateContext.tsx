import {
  ApolloCache,
  DefaultContext,
  FetchResult,
  MutationFunctionOptions,
  OperationVariables
} from '@apollo/client'
import { $, useTypedMutation } from 'graphql/generated/zeus/apollo'
import { createContext, ReactNode, useContext } from 'react'
import * as yup from 'yup'

type CreateContextProps = {
  createQuestionsGroup: (
    options?: MutationFunctionOptions<
      {
        insert_vendas_GruposDePerguntas_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createQuestionsGroupLoading: boolean
  questionGroupSchema: any
}

type ProviderProps = {
  children: ReactNode
}

export const CreateContext = createContext<CreateContextProps>(
  {} as CreateContextProps
)

export const CreateProvider = ({ children }: ProviderProps) => {
  const [createQuestionsGroup, { loading: createQuestionsGroupLoading }] =
    useTypedMutation({
      insert_vendas_GruposDePerguntas_one: [
        {
          object: {
            Nome: $`Nome`,
            Perguntas: {
              data: $`data`
            }
          }
        },
        { Id: true }
      ]
    })

  const questionGroupSchema = yup.object().shape({
    Nome: yup.string().required('Preencha o campo para continuar')
  })

  return (
    <CreateContext.Provider
      value={{
        createQuestionsGroup,
        createQuestionsGroupLoading,
        questionGroupSchema
      }}
    >
      {children}
    </CreateContext.Provider>
  )
}

export const useCreate = () => {
  return useContext(CreateContext)
}
