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
  createPlan: (
    options?: MutationFunctionOptions<
      {
        insert_comercial_Planos_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createPlanLoading: boolean
  planSchema: any
}

type ProviderProps = {
  children: ReactNode
}

export const CreateContext = createContext<CreateContextProps>(
  {} as CreateContextProps
)

export const CreateProvider = ({ children }: ProviderProps) => {
  const [createPlan, { loading: createPlanLoading }] = useTypedMutation({
    insert_comercial_Planos_one: [
      {
        object: {
          Nome: $`Nome`,
          Servico_Id: $`Servico_Id`,
          Condicionais: {
            data: $`data`
          },
          Precos: {
            data: [
              {
                ServicoPreco_Id: $`ServicoPreco_Id`,
                ValorPraticado: $`ValorPraticado`,
                ValorBase: $`ValorBase`
              }
            ]
          }
        }
      },
      { Id: true }
    ]
  })

  const planSchema = yup.object().shape({
    Nome: yup.string().required('Preencha o campo para continuar'),
    Servico_Id: yup.object().required('Selecione o serviço para continuar'),
    Valor: yup.string().required('Selecione o serviço para continuar')
  })

  return (
    <CreateContext.Provider
      value={{
        planSchema,
        createPlan,
        createPlanLoading
      }}
    >
      {children}
    </CreateContext.Provider>
  )
}

export const useCreate = () => {
  return useContext(CreateContext)
}
