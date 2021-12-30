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
import * as yup from 'yup'

type UpdateContextProps = {
  plansData?: {
    Id: string
    Nome: string
    Servico: {
      Id: string
      Nome: string
      Fornecedores: {
        Id: string
        Precos: { Id: string; Valor: string }[]
      }[]
    }
    Condicionais: {
      Id: string
      Valor: number
      Condicional: {
        Id: string
        Nome: string
        Situacao: { Valor: string; Comentario: string }
      }
      deleted_at?: Date
    }[]
    Precos: {
      Id: string
      ValorPraticado?: string
      ServicoPreco: {
        Id: string
        Valor: string
      }
      ValorBase: string
    }[]
  }

  plansRefetch: () => void
  plansLoading: boolean
  createPlanPrice: (
    options?: MutationFunctionOptions<
      {
        insert_comercial_Planos_Precos_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createPlanPriceLoading: boolean
  updatePlan: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Planos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updatePlanLoading: boolean
  updateCondicionalPlan: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Planos_Condicionais_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateCondicionalPlanLoading: boolean
  deleteCondicionalPlan: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Planos_Condicionais_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  deleteCondicionalPlanLoading: boolean
  planSchema: any
}

type ProviderProps = {
  children: ReactNode
}

export const UpdateContext = createContext<UpdateContextProps>(
  {} as UpdateContextProps
)

export const UpdateProvider = ({ children }: ProviderProps) => {
  const router = useRouter()

  const [createPlanPrice, { loading: createPlanPriceLoading }] =
    useTypedMutation({
      insert_comercial_Planos_Precos_one: [
        {
          object: {
            ServicoPreco_Id: $`ServicoPreco_Id`,
            ValorBase: $`ValorBase`,
            ValorPraticado: $`ValorPraticado`,
            Plano_Id: router.query.id
          }
        },
        { Id: true }
      ]
    })

  const [updatePlan, { loading: updatePlanLoading }] = useTypedMutation({
    update_comercial_Planos_by_pk: [
      {
        pk_columns: {
          Id: router.query.id
        },
        _set: {
          updated_at: new Date(),
          Nome: $`Nome`
        }
      },
      { Id: true }
    ]
  })

  const [updateCondicionalPlan, { loading: updateCondicionalPlanLoading }] =
    useTypedMutation({
      update_comercial_Planos_Condicionais_by_pk: [
        {
          pk_columns: {
            Id: $`Id`
          },
          _set: {
            Valor: $`Valor`,
            updated_at: new Date()
          }
        },
        { Id: true }
      ]
    })

  const [deleteCondicionalPlan, { loading: deleteCondicionalPlanLoading }] =
    useTypedMutation({
      update_comercial_Planos_Condicionais_by_pk: [
        {
          pk_columns: {
            Id: $`Id`
          },
          _set: {
            deleted_at: new Date()
          }
        },
        { Id: true }
      ]
    })

  const {
    data: plansData,
    refetch: plansRefetch,
    loading: plansLoading
  } = useTypedQuery(
    {
      comercial_Planos_by_pk: [
        {
          Id: router.query.id
        },
        {
          Id: true,
          Nome: true,
          Servico: {
            Id: true,
            Nome: true,
            Fornecedores: [
              {},
              {
                Id: true,
                Precos: [
                  { order_by: [{ created_at: 'desc' }] },
                  { Id: true, Valor: true }
                ]
              }
            ]
          },
          Condicionais: [
            { where: { deleted_at: { _is_null: true } } },
            {
              Id: true,
              Valor: true,
              Condicional: {
                Id: true,
                Nome: true,
                Situacao: { Valor: true, Comentario: true }
              },
              deleted_at: true
            }
          ],
          Precos: [
            {
              where: { Plano_Id: { _eq: router.query.id } },
              order_by: [{ created_at: 'desc' }]
            },
            {
              Id: true,
              ValorPraticado: true,
              ValorBase: true,
              ServicoPreco: {
                Id: true,
                Valor: true
              }
            }
          ]
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const planSchema = yup.object().shape({
    Nome: yup.string().required('Preencha o campo para continuar')
  })

  return (
    <UpdateContext.Provider
      value={{
        planSchema,
        plansData: plansData?.comercial_Planos_by_pk,
        plansRefetch,
        plansLoading,
        createPlanPrice,
        createPlanPriceLoading,
        updatePlan,
        updatePlanLoading,
        updateCondicionalPlan,
        updateCondicionalPlanLoading,
        deleteCondicionalPlan,
        deleteCondicionalPlanLoading
      }}
    >
      {children}
    </UpdateContext.Provider>
  )
}

export const useUpdate = () => {
  return useContext(UpdateContext)
}
