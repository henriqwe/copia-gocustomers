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
import * as yup from 'yup'

type CreateContextProps = {
  createProposal: (
    options?: MutationFunctionOptions<
      {
        insert_comercial_Propostas_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createProposalLoading: boolean
  proposalSchema: any
  paymentTypesData?: {
    Comentario: string
    Valor: string
  }[]
  recurrenceTypesData?: {
    Comentario: string
    Valor: string
  }[]
}

type ProviderProps = {
  children: ReactNode
}

export const CreateContext = createContext<CreateContextProps>(
  {} as CreateContextProps
)

export const CreateProvider = ({ children }: ProviderProps) => {
  const [createProposal, { loading: createProposalLoading }] = useTypedMutation(
    {
      insert_comercial_Propostas_one: [
        {
          object: {
            Lead_Id: $`Lead_Id`,
            Ticket_Id: $`Ticket_Id`,
            TipoDePagamento_Id: $`TipoDePagamento_Id`,
            TipoDeRecorrencia_Id: $`TipoDeRecorrencia_Id`,
            Usuario_Id: $`Usuario_Id`,
            Situacao_Id: 'criado',
            Cliente_Id: $`Cliente_Id`,
            Combos: {
              data: $`combosData`
            },
            Planos: {
              data: $`planosData`
            },
            Produtos: {
              data: $`produtosData`
            },
            Servicos: {
              data: $`servicosData`
            },
            Oportunidades: {
              data: $`oportunidadesData`
            }
          }
        },
        { Id: true }
      ]
    }
  )

  const proposalSchema = yup.object().shape({
    Ticket_Id: yup.object().required('Selecione um ticket para continuar')
  })

  const { data: paymentTypesData } = useTypedQuery({
    vendas_TiposDePagamento: [
      {},
      {
        Comentario: true,
        Valor: true
      }
    ]
  })

  const { data: recurrenceTypesData } = useTypedQuery({
    vendas_TiposDeRecorrencia: [
      {},
      {
        Comentario: true,
        Valor: true
      }
    ]
  })

  return (
    <CreateContext.Provider
      value={{
        createProposal,
        createProposalLoading,
        proposalSchema,
        paymentTypesData: paymentTypesData?.vendas_TiposDePagamento,
        recurrenceTypesData: recurrenceTypesData?.vendas_TiposDeRecorrencia
      }}
    >
      {children}
    </CreateContext.Provider>
  )
}

export const useCreate = () => {
  return useContext(CreateContext)
}
