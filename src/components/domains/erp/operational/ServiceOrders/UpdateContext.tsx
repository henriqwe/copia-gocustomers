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
  serviceOrderData?: {
    Id: string
    Tipo: {
      Valor: string
      Comentario: string
    }
    Situacao: {
      Valor: string
      Comentario: string
    }
    DataAgendamento?: Date
    CodigoIdentificador: number
  }
  serviceOrderRefetch: () => void
  serviceOrderLoading: boolean
  updateServiceOrdersLoading: boolean
  updateServiceOrders: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Produtos_by_pk?: {
          Id: string
        }
        insert_operacional_OrdemDeServico_Atividades_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  rejectServiceOrder: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Produtos_by_pk?: {
          Id: string
        }
        insert_operacional_OrdemDeServico_Atividades_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  rejectServiceOrderLoading: boolean
  concludeServiceOrder: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Produtos_by_pk?: {
          Id: string
        }
        insert_operacional_OrdemDeServico_Atividades_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  concludeServiceOrderLoading: boolean
  serviceOrdersSchema: any
  rejectSchema: any
}

type ProviderProps = {
  children: ReactNode
}

export const UpdateContext = createContext<UpdateContextProps>(
  {} as UpdateContextProps
)

export const UpdateProvider = ({ children }: ProviderProps) => {
  const router = useRouter()

  const [updateServiceOrders, { loading: updateServiceOrdersLoading }] =
    useTypedMutation({
      update_operacional_OrdemDeServico_by_pk: [
        {
          pk_columns: { Id: router.query.id },
          _set: {
            DataAgendamento: $`DataAgendamento`,
            Situacao_Id: 'agendada',
            updated_at: new Date()
          }
        },
        { Id: true }
      ],
      insert_operacional_OrdemDeServico_Atividades_one: [
        {
          object: {
            OrdemDeServico_Id: router.query.id,
            Situacao_Id: 'agendada',
            Usuario_Id: '7fd2e5d7-a4c4-485b-8675-e56052e3ff5f'
          }
        },
        {
          Id: true
        }
      ]
    })

  const [rejectServiceOrder, { loading: rejectServiceOrderLoading }] =
    useTypedMutation({
      update_operacional_OrdemDeServico_by_pk: [
        {
          pk_columns: { Id: router.query.id },
          _set: {
            Situacao_Id: 'frustada',
            updated_at: new Date()
          }
        },
        { Id: true }
      ],
      insert_operacional_OrdemDeServico_Atividades_one: [
        {
          object: {
            OrdemDeServico_Id: router.query.id,
            MotivoRecusado: $`MotivoRecusado`,
            Situacao_Id: 'frustada',
            Usuario_Id: '7fd2e5d7-a4c4-485b-8675-e56052e3ff5f'
          }
        },
        {
          Id: true
        }
      ]
    })

  const [concludeServiceOrder, { loading: concludeServiceOrderLoading }] =
    useTypedMutation({
      update_operacional_OrdemDeServico_by_pk: [
        {
          pk_columns: { Id: router.query.id },
          _set: {
            Situacao_Id: 'concluida',
            DataConcluida: new Date(),
            updated_at: new Date()
          }
        },
        { Id: true }
      ],
      insert_operacional_OrdemDeServico_Atividades_one: [
        {
          object: {
            OrdemDeServico_Id: router.query.id,
            Situacao_Id: 'concluida',
            Usuario_Id: '7fd2e5d7-a4c4-485b-8675-e56052e3ff5f'
          }
        },
        {
          Id: true
        }
      ]
    })

  const {
    data: serviceOrderData,
    refetch: serviceOrderRefetch,
    loading: serviceOrderLoading
  } = useTypedQuery(
    {
      operacional_OrdemDeServico_by_pk: [
        {
          Id: router.query.id
        },
        {
          Id: true,
          Tipo: {
            Valor: true,
            Comentario: true
          },
          Situacao: {
            Valor: true,
            Comentario: true
          },
          DataAgendamento: true,
          CodigoIdentificador: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const serviceOrdersSchema = yup.object().shape({
    DataAgendamento: yup.date().required('Preencha o campo para continuar')
  })

  const rejectSchema = yup.object().shape({
    MotivoRecusado: yup.string().required('Digite o motivo para continuar')
  })

  return (
    <UpdateContext.Provider
      value={{
        serviceOrderData: serviceOrderData?.operacional_OrdemDeServico_by_pk,
        serviceOrderRefetch,
        serviceOrderLoading,
        updateServiceOrdersLoading,
        updateServiceOrders,
        rejectServiceOrder,
        rejectServiceOrderLoading,
        concludeServiceOrder,
        concludeServiceOrderLoading,
        serviceOrdersSchema,
        rejectSchema
      }}
    >
      {children}
    </UpdateContext.Provider>
  )
}

export const useUpdate = () => {
  return useContext(UpdateContext)
}
