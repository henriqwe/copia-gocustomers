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
  useTypedClientQuery,
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

type TicketContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  usersData?: {
    Id: string
    Colaborador?: {
      Pessoa: {
        Nome: string
      }
    }
  }[]
  usersLoading: boolean
  usersRefetch: () => void
  ticketsData?: Ticket[]
  ticketsTypeData?: {
    Valor: string
    Comentario: string
  }[]
  ticketsLoading: boolean
  ticketsRefetch: () => void
  createTicket: (
    options?: MutationFunctionOptions<
      {
        insert_atendimentos_Tickets_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createTicketLoading: boolean
  softDeleteTicketLoading: boolean
  softDeleteTicket: (
    options?: MutationFunctionOptions<
      {
        update_atendimentos_Tickets_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateTicketLoading: boolean
  updateTicket: (
    options?: MutationFunctionOptions<
      {
        update_atendimentos_Tickets_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  getFlowStageByFlow_Id: (Id: string) => Promise<
    {
      Id: string
      Nome: string
    }[]
  >
  getTicketByPk: (Id: string) => Promise<Ticket | undefined>
  getActionByFlowStageId(Id: { key: string; title: string }): Promise<
    {
      Id: string
      Titulo: string
      Url: string
    }[]
  >
  ticketSchema: (personCategory: 'lead' | 'cliente' | undefined) => any
}

export type Ticket = {
  Id: string
  CodigoReferencia: number
  Tipo: {
    Valor: string
    Comentario: string
  }
  Etapa: {
    Id: string
    Nome: string
    Posicao: number
  }
  Fluxo: {
    Id: string
    Nome: string
  }
  Cliente?: {
    Id: string
    Pessoa: {
      Nome: string
    }
  }
  Lead?: {
    Id: string
    Nome: string
    Email: string
    Telefone: string
    PerfisComerciais: {
      Id: string
    }[]
  }
  Usuario: {
    Id: string
    Colaborador?: {
      Pessoa: {
        Nome: string
      }
    }
  }
  Propostas: {
    Id: string
  }[]
}

type ProviderProps = {
  children: ReactNode
}

type SlidePanelStateType = {
  type: 'create' | 'update' | 'view'
  data?: GraphQLTypes['atendimentos_Tickets'] | null
  open: boolean
}

export const TicketContext = createContext<TicketContextProps>(
  {} as TicketContextProps
)

export const TicketProvider = ({ children }: ProviderProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    type: 'create',
    open: false
  })

  const [createTicket, { loading: createTicketLoading }] = useTypedMutation({
    insert_atendimentos_Tickets_one: [
      {
        object: {
          Etapa_Id: $`Etapa_Id`,
          Tipo_Id: $`Tipo_Id`,
          Fluxo_Id: $`Fluxo_Id`,
          Cliente_Id: $`Cliente_Id`,
          Usuario_Id: $`Usuario_Id`,
          Lead_Id: $`Lead_Id`
        }
      },
      { Id: true }
    ]
  })

  const [updateTicket, { loading: updateTicketLoading }] = useTypedMutation({
    update_atendimentos_Tickets_by_pk: [
      {
        pk_columns: { Id: $`Id` },
        _set: {
          Etapa_Id: $`Etapa_Id`,
          Tipo_Id: $`Tipo_Id`,
          Fluxo_Id: $`Fluxo_Id`,
          Usuario_Id: $`Usuario_Id`,
          updated_at: new Date()
        }
      },
      { Id: true }
    ]
  })

  const [softDeleteTicket, { loading: softDeleteTicketLoading }] =
    useTypedMutation({
      update_atendimentos_Tickets_by_pk: [
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
    data: ticketsData,
    refetch: ticketsRefetch,
    loading: ticketsLoading
  } = useTypedQuery(
    {
      atendimentos_Tickets: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          CodigoReferencia: true,
          Tipo: {
            Valor: true,
            Comentario: true
          },
          Etapa: {
            Id: true,
            Nome: true,
            Posicao: true
          },
          Fluxo: {
            Id: true,
            Nome: true
          },
          Cliente: {
            Id: true,
            Pessoa: {
              Nome: true
            }
          },
          Lead: {
            Id: true,
            Nome: true,
            Email: true,
            Telefone: true
          },
          Usuario: {
            Id: true,
            Colaborador: {
              Pessoa: {
                Nome: true
              }
            }
          },
          Propostas: [
            {},
            {
              Id: true
            }
          ]
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const {
    data: usersData,
    refetch: usersRefetch,
    loading: usersLoading
  } = useTypedQuery(
    {
      autenticacao_Usuarios: [
        {
          where: {
            deleted_at: { _is_null: true },
            Colaborador_Id: { _is_null: false }
          }
        },
        {
          Id: true,
          Colaborador: {
            Pessoa: {
              Nome: true
            }
          }
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const { data: ticketsTypeData } = useTypedQuery(
    {
      atendimentos_TiposDeTickets: [
        {},
        {
          Valor: true,
          Comentario: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  async function getFlowStageByFlow_Id(Id: string) {
    const { data } = await useTypedClientQuery({
      atendimentos_EtapasDosFluxos: [
        {
          where: {
            Fluxo_Id: { _eq: Id }
          }
        },
        {
          Id: true,
          Nome: true
        }
      ]
    })
    return data.atendimentos_EtapasDosFluxos
  }

  async function getTicketByPk(Id: string) {
    const { data: ticketData } = await useTypedClientQuery({
      atendimentos_Tickets_by_pk: [
        {
          Id
        },
        {
          Id: true,
          CodigoReferencia: true,
          Tipo: {
            Valor: true,
            Comentario: true
          },
          Etapa: {
            Id: true,
            Nome: true,
            Posicao: true
          },
          Fluxo: {
            Id: true,
            Nome: true
          },
          Lead: {
            Id: true,
            Nome: true,
            Email: true,
            Telefone: true,
            PerfisComerciais: [
              {},
              {
                Id: true
              }
            ]
          },
          Usuario: {
            Id: true,
            Colaborador: {
              Pessoa: {
                Nome: true
              }
            }
          },
          Propostas: [
            {},
            {
              Id: true
            }
          ]
        }
      ]
    })
    return ticketData.atendimentos_Tickets_by_pk
  }

  async function getActionByFlowStageId(Id: { key: string; title: string }) {
    const { data: actionData } = await useTypedClientQuery(
      {
        comercial_Acoes: [
          {
            where: { Etapas_Id: { _contains: $`Contains` } }
          },
          {
            Id: true,
            Titulo: true,
            Url: true
          }
        ]
      },
      { Contains: [Id] }
    )
    return actionData.comercial_Acoes
  }

  function ticketSchema(personCategory: 'lead' | 'cliente' | undefined) {
    return yup.object().shape({
      Fluxo_Id: yup.object().required('Selecione o fluxo para continuar'),
      Tipo_Id: yup.object().required('Selecione o tipo para continuar'),
      Etapa_Id: yup.object().required('Selecione a etapa para continuar'),
      Usuario_Id: yup.object().required('Selecione a usuário para continuar'),
      Lead_Id:
        personCategory === 'lead'
          ? yup.object().required('Selecione a lead para continuar')
          : yup.object(),
      Cliente_Id:
        personCategory === 'cliente'
          ? yup.object().required('Selecione a cliente para continuar')
          : yup.object()
    })
  }

  return (
    <TicketContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        getFlowStageByFlow_Id,
        ticketsTypeData: ticketsTypeData?.atendimentos_TiposDeTickets,
        ticketsData: ticketsData?.atendimentos_Tickets,
        ticketsRefetch,
        ticketsLoading,
        createTicket,
        createTicketLoading,
        softDeleteTicketLoading,
        softDeleteTicket,
        updateTicketLoading,
        updateTicket,
        ticketSchema,
        usersData: usersData?.autenticacao_Usuarios,
        usersLoading,
        usersRefetch,
        getTicketByPk,
        getActionByFlowStageId
      }}
    >
      {children}
    </TicketContext.Provider>
  )
}

export const useTicket = () => {
  return useContext(TicketContext)
}
