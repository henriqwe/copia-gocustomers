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

type StageContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  stagesData?: {
    Fluxo: {
      Id: string
      Nome: string
    }
    Nome: string
    Id: string
    Posicao: number
    Tickets: {
      Id: string
      Usuario: {
        Id: string
        Colaborador?: {
          Pessoa: {
            Nome: string
          }
        }
      }
      Lead: { Id: string; Nome: string }
    }[]
  }[]

  stagesRefetch: () => void
  stagesLoading: boolean
  createFlowStage: (
    options?: MutationFunctionOptions<
      {
        insert_atendimentos_EtapasDosFluxos_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createFlowStageLoading: boolean
  softDeleteFlowStagesLoading: boolean
  softDeleteFlowStages: (
    options?: MutationFunctionOptions<
      {
        update_atendimentos_EtapasDosFluxos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateFlowStageLoading: boolean
  updateFlowStage: (
    options?: MutationFunctionOptions<
      {
        update_atendimentos_EtapasDosFluxos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  changeTicketFlowStage: (
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
  changeTicketFlowStageLoading: boolean
  stageSchema: any
  getFlowById: (Id: string) => Promise<
    | {
        Id: string
        Etapas: {
          Id: string
          Nome: string
          Fluxo: {
            Id: string
            Nome: string
          }
          Tickets: {
            Id: string
            CodigoReferencia: number
            Lead: {
              Id: string
              Nome: string
            }
            Usuario: {
              Id: string
              Colaborador?:
                | {
                    Pessoa: {
                      Nome: string
                    }
                  }
                | undefined
            }
          }[]
          Posicao: number
        }[]
      }
    | undefined
  >
}

type ProviderProps = {
  children: ReactNode
}

type SlidePanelStateType = {
  type: 'create' | 'update'
  data?: GraphQLTypes['atendimentos_EtapasDosFluxos'] | null
  open: boolean
}

export const StageContext = createContext<StageContextProps>(
  {} as StageContextProps
)

export const StageProvider = ({ children }: ProviderProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    type: 'create',
    open: false
  })

  const [createFlowStage, { loading: createFlowStageLoading }] =
    useTypedMutation({
      insert_atendimentos_EtapasDosFluxos_one: [
        {
          object: {
            Posicao: $`Posicao`,
            Fluxo_Id: $`Fluxo_Id`,
            Nome: $`Nome`
          }
        },
        { Id: true }
      ]
    })

  const [updateFlowStage, { loading: updateFlowStageLoading }] =
    useTypedMutation({
      update_atendimentos_EtapasDosFluxos_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            Posicao: $`Posicao`,
            Fluxo_Id: $`Fluxo_Id`,
            Nome: $`Nome`,
            updated_at: new Date()
          }
        },
        { Id: true }
      ]
    })

  const [softDeleteFlowStages, { loading: softDeleteFlowStagesLoading }] =
    useTypedMutation({
      update_atendimentos_EtapasDosFluxos_by_pk: [
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
    data: stagesData,
    refetch: stagesRefetch,
    loading: stagesLoading
  } = useTypedQuery(
    {
      atendimentos_EtapasDosFluxos: [
        {
          order_by: [{ Posicao: 'asc' }],
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          Posicao: true,
          Fluxo: {
            Id: true,
            Nome: true
          },
          Nome: true,
          Tickets: [
            {},
            {
              Id: true,
              CodigoReferencia: true,
              Usuario: {
                Id: true,
                Colaborador: {
                  Pessoa: {
                    Nome: true
                  }
                }
              },
              Lead: { Id: true, Nome: true }
            }
          ]
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const [changeTicketFlowStage, { loading: changeTicketFlowStageLoading }] =
    useTypedMutation({
      update_atendimentos_Tickets_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            Etapa_Id: $`Etapa_Id`,
            updated_at: new Date()
          }
        },
        {
          Id: true
        }
      ]
    })

  async function getFlowById(Id: string) {
    const { data: flowData } = await useTypedClientQuery({
      atendimentos_Fluxos_by_pk: [
        {
          Id
        },
        {
          Id: true,
          Etapas: [
            {
              where: { deleted_at: { _is_null: true } },
              order_by: [{ Posicao: 'asc' }]
            },
            {
              Id: true,
              Posicao: true,
              Fluxo: {
                Id: true,
                Nome: true
              },
              Nome: true,
              Tickets: [
                { where: { deleted_at: { _is_null: true } } },
                {
                  Id: true,
                  Usuario: {
                    Id: true,
                    Colaborador: {
                      Pessoa: {
                        Nome: true
                      }
                    }
                  },
                  Lead: { Id: true, Nome: true }
                }
              ]
            }
          ]
        }
      ]
    })
    return flowData.atendimentos_Fluxos_by_pk
  }

  const stageSchema = yup.object().shape({
    Nome: yup.string().required('Preencha o campo para continuar'),
    Posicao: yup.string().required('Preencha o campo para continuar'),
    Fluxo_Id: yup.object().required('Selecione um fluxo para continuar')
  })

  // FIXME corrigir tipo global para mutations
  return (
    <StageContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        stagesData: stagesData?.atendimentos_EtapasDosFluxos,
        stagesRefetch,
        stagesLoading,
        createFlowStage,
        createFlowStageLoading,
        softDeleteFlowStagesLoading,
        softDeleteFlowStages,
        updateFlowStageLoading,
        updateFlowStage,
        changeTicketFlowStage,
        changeTicketFlowStageLoading,
        stageSchema,
        getFlowById
      }}
    >
      {children}
    </StageContext.Provider>
  )
}

export const useStage = () => {
  return useContext(StageContext)
}
