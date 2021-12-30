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

type ServiceOrdersContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  serviceOrdersData?: {
    Id: string
    Situacao: {
      Comentario: string
    }
    Tipo: {
      Comentario: string
    }
    CodigoIdentificador: number
  }[]

  serviceOrdersRefetch: () => void
  serviceOrdersLoading: boolean

  serviceOrdersTypesData?: {
    Comentario: string
    Valor: string
  }[]
  serviceOrdersTypesRefetch: () => void
  serviceOrdersTypesLoading: boolean
  proposalsData?: {
    Id: string
    Lead: {
      Nome: string
    }
    Usuario: {
      Colaborador?: {
        Pessoa: {
          Nome: string
        }
      }
    }
  }[]
  proposalsLoading: boolean
  proposalsRefetch: () => void
  createServiceOrder: (
    options?: MutationFunctionOptions<
      {
        insert_operacional_OrdemDeServico_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createServiceOrderLoading: boolean
  softDeleteServiceOrderLoading: boolean
  softDeleteServiceOrder: (
    options?: MutationFunctionOptions<
      {
        update_operacional_OrdemDeServico_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  serviceOrderschema: any
}

type ProviderProps = {
  children: ReactNode
}

type SlidePanelStateType = {
  data?: GraphQLTypes['comercial_Produtos'] | null
  open: boolean
}

export const ServiceOrderContext = createContext<ServiceOrdersContextProps>(
  {} as ServiceOrdersContextProps
)

export const ServiceOrderProvider = ({ children }: ProviderProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    open: false
  })

  const [createServiceOrder, { loading: createServiceOrderLoading }] =
    useTypedMutation({
      insert_operacional_OrdemDeServico_one: [
        {
          object: {
            DataAgendamento: $`DataAgendamento`,
            Situacao_Id: 'aberta',
            Proposta_Id: $`Proposta_Id`,
            Tipo_Id: $`Tipo_Id`,
            Atividades: {
              data: [
                {
                  Situacao_Id: 'aberta',
                  Usuario_Id: '7fd2e5d7-a4c4-485b-8675-e56052e3ff5f'
                }
              ]
            }
          }
        },
        { Id: true }
      ]
    })

  const [softDeleteServiceOrder, { loading: softDeleteServiceOrderLoading }] =
    useTypedMutation({
      update_operacional_OrdemDeServico_by_pk: [
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
    data: serviceOrdersData,
    refetch: serviceOrdersRefetch,
    loading: serviceOrdersLoading
  } = useTypedQuery(
    {
      operacional_OrdemDeServico: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          Situacao: {
            Comentario: true
          },
          Tipo: {
            Comentario: true
          },
          CodigoIdentificador: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const {
    data: serviceOrdersTypesData,
    refetch: serviceOrdersTypesRefetch,
    loading: serviceOrdersTypesLoading
  } = useTypedQuery(
    {
      operacional_OrdemDeServico_Tipo: [
        {},
        {
          Comentario: true,
          Valor: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const {
    data: proposalsData,
    refetch: proposalsRefetch,
    loading: proposalsLoading
  } = useTypedQuery(
    {
      comercial_Propostas: [
        {
          where: { Situacao: { Valor: { _eq: 'aceito' } } }
        },
        {
          Id: true,
          Lead: {
            Nome: true
          },
          Usuario: {
            Colaborador: {
              Pessoa: {
                Nome: true
              }
            }
          }
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const serviceOrderschema = yup.object().shape({
    Tipo: yup.object().required('Selecione um tipo para continuar'),
    Proposta: yup.object().required('Selecione uma proposta para continuar')
  })

  return (
    <ServiceOrderContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        serviceOrdersData: serviceOrdersData?.operacional_OrdemDeServico,
        serviceOrdersRefetch,
        serviceOrdersLoading,
        serviceOrdersTypesData:
          serviceOrdersTypesData?.operacional_OrdemDeServico_Tipo,
        serviceOrdersTypesRefetch,
        serviceOrdersTypesLoading,
        proposalsData: proposalsData?.comercial_Propostas,
        proposalsLoading,
        proposalsRefetch,
        createServiceOrder,
        createServiceOrderLoading,
        softDeleteServiceOrderLoading,
        softDeleteServiceOrder,
        serviceOrderschema
      }}
    >
      {children}
    </ServiceOrderContext.Provider>
  )
}

export const useServiceOrder = () => {
  return useContext(ServiceOrderContext)
}
