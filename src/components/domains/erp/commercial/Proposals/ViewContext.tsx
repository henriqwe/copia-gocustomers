import {
  ApolloCache,
  DefaultContext,
  FetchResult,
  MutationFunctionOptions,
  OperationVariables
} from '@apollo/client'
import { GraphQLTypes } from 'graphql/generated/zeus'
import {
  useTypedClientQuery,
  useTypedMutation,
  useTypedQuery,
  $
} from 'graphql/generated/zeus/apollo'
import { useRouter } from 'next/router'
import {
  ReactNode,
  useContext,
  createContext,
  useState,
  Dispatch,
  SetStateAction
} from 'react'
import * as yup from 'yup'

type ViewContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  proposalData?: {
    Id: string
    Cliente?: {
      Id: string
      Pessoa: {
        Nome: string
      }
    }
    Lead: {
      Id: string
      Nome: string
    }
    Ticket: {
      Id: string
      Lead: {
        Nome: string
      }
    }
    TipoDePagamento: {
      Comentario: string
      Valor: string
    }
    TipoDeRecorrencia: {
      Comentario: string
      Valor: string
    }
    Usuario: {
      Id: string
      Cliente?: {
        Pessoa: {
          Nome: string
        }
      }
      Colaborador?: {
        Pessoa: {
          Nome: string
        }
      }
    }
  } & ProposalsArray
  proposalInstallationsData?: {
    Id: string
    Endereco: any
    VeiculoRelacionamento?: {
      Id: string
      Apelido?: string
      Placa?: string
      NumeroDoChassi?: string
      Categoria: {
        Id: string
        Nome: string
      }
    }
    Veiculo?: number
  }[]
  proposalInstallationsRefetch: () => void
  proposalInstallationsLoading: boolean
  proposalRefetch: () => void
  proposalLoading: boolean
  getProposalArray(position: number): Promise<ProposalsArray | undefined>
  getProposalInstallationByVehiclePosition(vehicle: number): Promise<
    | {
        Endereco: boolean | never[] | unknown
        Id: any
        Veiculo_Id: string
      }[]
    | undefined
  >
  createProposalCombo: (
    options?: MutationFunctionOptions<
      {
        insert_comercial_Propostas_Combos_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createProposalService: (
    options?: MutationFunctionOptions<
      {
        insert_comercial_Propostas_Servicos_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createProposalPlan: (
    options?: MutationFunctionOptions<
      {
        insert_comercial_Propostas_Planos_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createProposalProduct: (
    options?: MutationFunctionOptions<
      {
        insert_comercial_Propostas_Produtos_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createProposalUpSelling: (
    options?: MutationFunctionOptions<
      {
        insert_comercial_Propostas_Oportunidades_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createProposalInstalation: (
    options?: MutationFunctionOptions<
      {
        insert_comercial_Propostas_Instalacoes_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateProposalInstalation: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Propostas_Instalacoes_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateProposalCombo: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Propostas_Combos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateProposalService: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Propostas_Servicos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateProposalPlan: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Propostas_Planos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateProposalProduct: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Propostas_Produtos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateProposalUpSelling: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Propostas_Oportunidades_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  deleteProposalInstalation: (
    options?: MutationFunctionOptions<
      {
        delete_comercial_Propostas_Instalacoes_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  deleteProposalCombo: (
    options?: MutationFunctionOptions<
      {
        delete_comercial_Propostas_Combos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  deleteProposalService: (
    options?: MutationFunctionOptions<
      {
        delete_comercial_Propostas_Servicos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  deleteProposalPlan: (
    options?: MutationFunctionOptions<
      {
        delete_comercial_Propostas_Planos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  deleteProposalProduct: (
    options?: MutationFunctionOptions<
      {
        delete_comercial_Propostas_Produtos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  deleteProposalUpSelling: (
    options?: MutationFunctionOptions<
      {
        delete_comercial_Propostas_Oportunidades_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  acceptProposal: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Propostas_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  addClientToProposal: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Propostas_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  refuseProposal: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Propostas_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  refuseProposalLoading: boolean
  addClientToProposalLoading: boolean
  acceptProposalLoading: boolean
  createProposalComboLoading: boolean
  createProposalServiceLoading: boolean
  createProposalPlanLoading: boolean
  createProposalProductLoading: boolean
  createProposalUpSellingLoading: boolean
  createProposalInstalationLoading: boolean
  updateProposalInstalationLoading: boolean
  updateProposalComboLoading: boolean
  updateProposalServiceLoading: boolean
  updateProposalPlanLoading: boolean
  updateProposalProductLoading: boolean
  updateProposalUpSellingLoading: boolean
  deleteProposalServiceLoading: boolean
  deleteProposalPlanLoading: boolean
  deleteProposalProductLoading: boolean
  deleteProposalUpSellingLoading: boolean
  deleteProposalComboLoading: boolean
  deleteProposalInstalationLoading: boolean
  addressSchema: any
}

export type ProposalsArray = {
  Id: string
  Situacao: {
    Comentario: string
    Valor: string
  }
  Combos: {
    Id: string
    ComboPreco: { Id: string; ValorBase: string }
    Veiculo: number
    VeiculoRelacionamento?: {
      Id: string
      Placa?: string
      NumeroDoChassi?: string
      Categoria: {
        Id: string
        Nome: string
      }
      Apelido?: string
    }
    Combo: {
      Id: string
      Nome: string
      Precos: { ValorBase: string }[]
      Planos: {
        Id: string
        Plano: {
          Nome: string
        }
        ValorPraticado: string
      }[]
      Produtos: {
        Id: string
        ValorPraticado: string
        Produto: {
          Id: string
          Nome: string
        }
      }[]
      Servicos: {
        Id: string
        ValorPraticado: string
        Servico: {
          Id: string
          Nome: string
        }
      }[]
      OportunidadesDeProdutos?: {
        Id: string
        Nome: string
        Valor: string
      }[]
      OportunidadesDeServicos?: {
        Id: string
        Nome: string
        Valor: string
      }[]
      Combos: {
        Id: string
        Valor: string
        Combo: {
          Planos: {
            Id: string
            Plano: {
              Nome: string
            }
          }[]
          Produtos: {
            Id: string
            Produto: {
              Id: string
              Nome: string
            }
          }[]
          Servicos: {
            Id: string
            Servico: {
              Id: string
              Nome: string
            }
          }[]
        }
      }[]
    }
  }[]
  Planos: {
    Id: string
    PlanoPreco: {
      Id: string
      ValorBase: string
      ValorPraticado?: string
      ServicoPreco: {
        Id: string
        Valor: string
      }
    }
    Veiculo: number
    VeiculoRelacionamento?: {
      Id: string
      Placa?: string
      NumeroDoChassi?: string
      Categoria: {
        Id: string
        Nome: string
      }
      Apelido?: string
    }
    Plano: {
      Id: string
      Nome: string
      Precos: {
        ValorBase: string
        ValorPraticado?: string
        ServicoPreco: {
          Id: string
          Valor: string
        }
      }[]
      Servico: {
        Nome: string
      }
    }
  }[]
  Produtos: {
    Id: string
    ProdutoPreco: { Id: string; Valor: string }
    Veiculo: number
    VeiculoRelacionamento?: {
      Id: string
      Placa?: string
      NumeroDoChassi?: string
      Categoria: {
        Id: string
        Nome: string
      }
      Apelido?: string
    }
    Produto: {
      Id: string
      Nome: string
      ProdutosQueDependo: {
        Id: string
        ProdutoDependente: { Nome: string }
      }[]
      Servicos_Produtos: {
        Id: string
        Servico: {
          Nome: string
        }
      }[]
    }
  }[]
  Servicos: {
    Id: string
    ServicosPreco: {
      Id: string
      Valor: string
    }
    Veiculo: number
    VeiculoRelacionamento?: {
      Id: string
      Placa?: string
      NumeroDoChassi?: string
      Categoria: {
        Id: string
        Nome: string
      }
      Apelido?: string
    }
    Servico: {
      Id: string
      Nome: string
      Produtos_Servicos: { Id: string; Produto: { Nome: string } }[]
      servicosServicos: {
        Id: string
        Servico: {
          Nome: string
        }
      }[]
    }
  }[]
  Oportunidades: {
    Id: string
    Veiculo: number
    VeiculoRelacionamento?: {
      Id: string
      Placa: string
      NumeroDoChassi?: string
      Categoria: {
        Id: string
        Nome: string
      }
      Apelido?: string
    }
    OportunidadeDeProduto?: {
      Id: string
      Nome: string
    }
    OportunidadeDeServico?: {
      Id: string
      Nome: string
    }
  }[]
}

type ProviderProps = {
  children: ReactNode
}

type SlidePanelStateType = {
  open: boolean
  type: 'createClient' | 'createAddress' | 'updateAddress'
  data?: GraphQLTypes['comercial_Propostas_Instalacoes']
}

export const ViewContext = createContext<ViewContextProps>(
  {} as ViewContextProps
)

export const ViewProvider = ({ children }: ProviderProps) => {
  const router = useRouter()
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    open: false,
    type: 'createClient'
  })

  const [createProposalCombo, { loading: createProposalComboLoading }] =
    useTypedMutation({
      insert_comercial_Propostas_Combos_one: [
        {
          object: {
            Combo_Id: $`Combo_Id`,
            Proposta_Id: router.query.id,
            ComboPreco_Id: $`ComboPreco_Id`,
            Veiculo_Id: $`Veiculo_Id`,
            Veiculo: $`Veiculo`
          }
        },
        { Id: true }
      ]
    })

  const [createProposalService, { loading: createProposalServiceLoading }] =
    useTypedMutation({
      insert_comercial_Propostas_Servicos_one: [
        {
          object: {
            Servico_Id: $`Servico_Id`,
            Proposta_Id: router.query.id,
            ServicosPreco_Id: $`ServicosPreco_Id`,
            Veiculo_Id: $`Veiculo_Id`,
            Veiculo: $`Veiculo`
          }
        },
        { Id: true }
      ]
    })

  const [createProposalPlan, { loading: createProposalPlanLoading }] =
    useTypedMutation({
      insert_comercial_Propostas_Planos_one: [
        {
          object: {
            Plano_Id: $`Plano_Id`,
            Proposta_Id: router.query.id,
            PlanoPreco_Id: $`PlanoPreco_Id`,
            Veiculo_Id: $`Veiculo_Id`,
            Veiculo: $`Veiculo`
          }
        },
        { Id: true }
      ]
    })

  const [createProposalProduct, { loading: createProposalProductLoading }] =
    useTypedMutation({
      insert_comercial_Propostas_Produtos_one: [
        {
          object: {
            Produto_Id: $`Produto_Id`,
            Proposta_Id: router.query.id,
            ProdutoPreco_Id: $`ProdutoPreco_Id`,
            Veiculo_Id: $`Veiculo_Id`,
            Veiculo: $`Veiculo`,

            Oportunidades: {
              data: $`oportunidadesData`
            }
          }
        },
        { Id: true }
      ]
    })

  const [createProposalUpSelling, { loading: createProposalUpSellingLoading }] =
    useTypedMutation({
      insert_comercial_Propostas_Oportunidades_one: [
        {
          object: {
            OportunidadeProduto_Id: $`OportunidadeProduto_Id`,
            OportunidadeServico_Id: $`OportunidadeServico_Id`,
            Proposta_Id: router.query.id,
            Veiculo: $`Veiculo`
          }
        },
        { Id: true }
      ]
    })

  const [acceptProposal, { loading: acceptProposalLoading }] = useTypedMutation(
    {
      update_comercial_Propostas_by_pk: [
        {
          pk_columns: { Id: router.query.id },
          _set: {
            Situacao_Id: 'aceito',
            DataAceito: new Date(),
            updated_at: new Date()
          }
        },
        {
          Id: true
        }
      ]
    }
  )

  const [refuseProposal, { loading: refuseProposalLoading }] = useTypedMutation(
    {
      update_comercial_Propostas_by_pk: [
        {
          pk_columns: { Id: router.query.id },
          _set: {
            Situacao_Id: 'recusado',
            updated_at: new Date()
          }
        },
        {
          Id: true
        }
      ]
    }
  )

  const [addClientToProposal, { loading: addClientToProposalLoading }] =
    useTypedMutation({
      update_comercial_Propostas_by_pk: [
        {
          pk_columns: { Id: router.query.id },
          _set: {
            Cliente_Id: $`Cliente_Id`,
            updated_at: new Date()
          }
        },
        {
          Id: true
        }
      ]
    })

  const [updateProposalCombo, { loading: updateProposalComboLoading }] =
    useTypedMutation({
      update_comercial_Propostas_Combos_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            Combo_Id: $`Combo_Id`,
            Veiculo_Id: $`Veiculo_Id`,
            ComboPreco_Id: $`ComboPreco_Id`,
            updated_at: new Date()
          }
        },
        {
          Id: true
        }
      ]
    })

  const [updateProposalService, { loading: updateProposalServiceLoading }] =
    useTypedMutation({
      update_comercial_Propostas_Servicos_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            Servico_Id: $`Servico_Id`,
            Veiculo_Id: $`Veiculo_Id`,
            ServicosPreco_Id: $`ServicosPreco_Id`,
            updated_at: new Date()
          }
        },
        { Id: true }
      ]
    })

  const [updateProposalPlan, { loading: updateProposalPlanLoading }] =
    useTypedMutation({
      update_comercial_Propostas_Planos_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            Plano_Id: $`Plano_Id`,
            Veiculo_Id: $`Veiculo_Id`,
            PlanoPreco_Id: $`PlanoPreco_Id`,
            updated_at: new Date()
          }
        },
        { Id: true }
      ]
    })

  const [updateProposalProduct, { loading: updateProposalProductLoading }] =
    useTypedMutation({
      update_comercial_Propostas_Produtos_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            updated_at: new Date(),
            Produto_Id: $`Produto_Id`,
            ProdutoPreco_Id: $`ProdutoPreco_Id`,
            Veiculo_Id: $`Veiculo_Id`
          }
        },
        { Id: true }
      ]
    })

  const [updateProposalUpSelling, { loading: updateProposalUpSellingLoading }] =
    useTypedMutation({
      update_comercial_Propostas_Oportunidades_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            Veiculo_Id: $`Veiculo_Id`
          }
        },
        { Id: true }
      ]
    })
  const [deleteProposalCombo, { loading: deleteProposalComboLoading }] =
    useTypedMutation({
      delete_comercial_Propostas_Combos_by_pk: [
        {
          Id: $`Id`
        },
        {
          Id: true
        }
      ]
    })

  const [deleteProposalService, { loading: deleteProposalServiceLoading }] =
    useTypedMutation({
      delete_comercial_Propostas_Servicos_by_pk: [
        {
          Id: $`Id`
        },
        { Id: true }
      ]
    })

  const [deleteProposalPlan, { loading: deleteProposalPlanLoading }] =
    useTypedMutation({
      delete_comercial_Propostas_Planos_by_pk: [
        {
          Id: $`Id`
        },
        { Id: true }
      ]
    })

  const [deleteProposalProduct, { loading: deleteProposalProductLoading }] =
    useTypedMutation({
      delete_comercial_Propostas_Produtos_by_pk: [
        {
          Id: $`Id`
        },
        { Id: true }
      ]
    })

  const [deleteProposalUpSelling, { loading: deleteProposalUpSellingLoading }] =
    useTypedMutation({
      delete_comercial_Propostas_Oportunidades_by_pk: [
        {
          Id: $`Id`
        },
        { Id: true }
      ]
    })

  const [
    createProposalInstalation,
    { loading: createProposalInstalationLoading }
  ] = useTypedMutation({
    insert_comercial_Propostas_Instalacoes_one: [
      {
        object: {
          Endereco: $`Endereco`,
          Veiculo_Id: $`Veiculo_Id`,
          Veiculo: $`Veiculo`,
          Proposta_Id: router.query.id
        }
      },
      { Id: true }
    ]
  })

  const [
    updateProposalInstalation,
    { loading: updateProposalInstalationLoading }
  ] = useTypedMutation({
    update_comercial_Propostas_Instalacoes_by_pk: [
      {
        pk_columns: {
          Id: $`Id`
        },
        _set: {
          Endereco: $`Endereco`,
          Veiculo_Id: $`Veiculo_Id`
        }
      },
      { Id: true }
    ]
  })

  const [
    deleteProposalInstalation,
    { loading: deleteProposalInstalationLoading }
  ] = useTypedMutation({
    delete_comercial_Propostas_Instalacoes_by_pk: [
      {
        Id: $`Id`
      },
      { Id: true }
    ]
  })

  const {
    data: proposalInstallationsData,
    refetch: proposalInstallationsRefetch,
    loading: proposalInstallationsLoading
  } = useTypedQuery({
    comercial_Propostas_Instalacoes: [
      {
        where: { deleted_at: { _is_null: true } }
      },
      {
        Id: true,
        Endereco: true,
        Veiculo: true,
        VeiculoRelacionamento: {
          Id: true,
          Apelido: true,
          Placa: true,
          NumeroDoChassi: true,
          Categoria: {
            Id: true,
            Nome: true
          }
        }
      }
    ]
  })

  const {
    data: proposalData,
    refetch: proposalRefetch,
    loading: proposalLoading
  } = useTypedQuery(
    {
      comercial_Propostas_by_pk: [
        { Id: router.query.id },
        {
          Id: true,
          Cliente: {
            Id: true,
            Pessoa: {
              Nome: true
            }
          },
          Lead: {
            Id: true,
            Nome: true
          },
          Ticket: {
            Id: true,
            Lead: {
              Nome: true
            }
          },
          TipoDePagamento: {
            Comentario: true,
            Valor: true
          },
          TipoDeRecorrencia: {
            Comentario: true,
            Valor: true
          },
          Usuario: {
            Id: true,
            Cliente: {
              Pessoa: {
                Nome: true
              }
            },
            Colaborador: {
              Pessoa: {
                Nome: true
              }
            }
          },
          Situacao: {
            Comentario: true,
            Valor: true
          },
          Combos: [
            { where: { deleted_at: { _is_null: true } } },
            {
              Id: true,
              ComboPreco: { Id: true, ValorBase: true },
              Veiculo: true,
              VeiculoRelacionamento: {
                Id: true,
                Placa: true,
                NumeroDoChassi: true,
                Categoria: {
                  Id: true,
                  Nome: true
                },
                Apelido: true
              },
              Combo: {
                Id: true,
                Nome: true,
                Precos: [
                  { order_by: [{ created_at: 'desc' }] },
                  { ValorBase: true }
                ],
                Planos: [
                  { where: { deleted_at: { _is_null: true } } },
                  {
                    Id: true,
                    ValorPraticado: true,
                    Plano: {
                      Nome: true
                    }
                  }
                ],
                Produtos: [
                  { where: { deleted_at: { _is_null: true } } },
                  {
                    Id: true,
                    ValorPraticado: true,
                    Produto: {
                      Id: true,
                      Nome: true
                    }
                  }
                ],
                Servicos: [
                  { where: { deleted_at: { _is_null: true } } },
                  {
                    Id: true,
                    ValorPraticado: true,
                    Servico: {
                      Id: true,
                      Nome: true
                    }
                  }
                ],
                OportunidadesDeProdutos: [
                  {},
                  {
                    Id: true,
                    Nome: true,
                    Valor: true
                  }
                ],
                OportunidadesDeServicos: [
                  {},
                  {
                    Id: true,
                    Nome: true,
                    Valor: true
                  }
                ],
                Combos: [
                  { where: { deleted_at: { _is_null: true } } },
                  {
                    Id: true,
                    Valor: true,
                    Combo: {
                      Planos: [
                        { where: { deleted_at: { _is_null: true } } },
                        {
                          Id: true,
                          Plano: {
                            Nome: true
                          }
                        }
                      ],
                      Produtos: [
                        { where: { deleted_at: { _is_null: true } } },
                        {
                          Id: true,
                          Produto: {
                            Id: true,
                            Nome: true
                          }
                        }
                      ],
                      Servicos: [
                        { where: { deleted_at: { _is_null: true } } },
                        {
                          Id: true,
                          Servico: {
                            Id: true,
                            Nome: true
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ],
          Planos: [
            {},
            {
              Id: true,
              PlanoPreco: {
                Id: true,
                ValorBase: true,
                ValorPraticado: true,
                ServicoPreco: { Valor: true, Id: true }
              },
              Veiculo: true,
              VeiculoRelacionamento: {
                Id: true,
                Placa: true,
                NumeroDoChassi: true,
                Categoria: {
                  Id: true,
                  Nome: true
                },
                Apelido: true
              },
              Plano: {
                Id: true,
                Nome: true,
                Precos: [
                  { order_by: [{ created_at: 'desc' }] },
                  {
                    ValorBase: true,
                    ValorPraticado: true,
                    ServicoPreco: { Valor: true, Id: true }
                  }
                ],
                Servico: {
                  Nome: true
                }
              }
            }
          ],
          Produtos: [
            {},
            {
              Id: true,
              ProdutoPreco: { Id: true, Valor: true },
              Veiculo: true,
              VeiculoRelacionamento: {
                Id: true,
                Placa: true,
                NumeroDoChassi: true,
                Categoria: {
                  Id: true,
                  Nome: true
                },
                Apelido: true
              },
              Produto: {
                Id: true,
                Nome: true,
                ProdutosQueDependo: [
                  {
                    where: {
                      deleted_at: { _is_null: true }
                    }
                  },
                  {
                    Id: true,
                    ProdutoDependente: { Nome: true }
                  }
                ],
                Servicos_Produtos: [
                  {
                    where: {
                      deleted_at: { _is_null: true }
                    }
                  },
                  {
                    Id: true,
                    Servico: {
                      Nome: true
                    }
                  }
                ]
              }
            }
          ],
          Servicos: [
            {},
            {
              Id: true,
              ServicosPreco: {
                Id: true,
                Valor: true
              },
              Veiculo: true,
              VeiculoRelacionamento: {
                Id: true,
                Placa: true,
                NumeroDoChassi: true,
                Categoria: {
                  Id: true,
                  Nome: true
                },
                Apelido: true
              },
              Servico: {
                Id: true,
                Nome: true,
                Produtos_Servicos: [
                  {
                    where: {
                      deleted_at: { _is_null: true }
                    }
                  },
                  { Id: true, Produto: { Nome: true } }
                ],
                servicosServicos: [
                  {
                    where: {
                      deleted_at: { _is_null: true }
                    }
                  },
                  {
                    Id: true,
                    Servico: {
                      Nome: true
                    }
                  }
                ]
              }
            }
          ],
          Oportunidades: [
            {},
            {
              Id: true,
              Veiculo: true,
              VeiculoRelacionamento: {
                Id: true,
                Placa: true,
                NumeroDoChassi: true,
                Categoria: {
                  Id: true,
                  Nome: true
                },
                Apelido: true
              },
              OportunidadeDeProduto: {
                Id: true,
                Nome: true
              },
              OportunidadeDeServico: {
                Id: true,
                Nome: true
              }
            }
          ]
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  async function getProposalArray(position: number) {
    if (router.query.id) {
      const { data: proposalArrayData } = await useTypedClientQuery({
        comercial_Propostas_by_pk: [
          { Id: router.query.id },
          {
            Id: true,
            Situacao: {
              Comentario: true,
              Valor: true
            },
            Combos: [
              {
                where: {
                  Veiculo: { _eq: position },
                  deleted_at: { _is_null: true }
                }
              },
              {
                Id: true,
                Veiculo: true,
                ComboPreco: {
                  Id: true,
                  ValorBase: true
                },
                VeiculoRelacionamento: {
                  Id: true,
                  Placa: true,
                  NumeroDoChassi: true,
                  Categoria: {
                    Id: true,
                    Nome: true
                  },
                  Apelido: true
                },
                Combo: {
                  Id: true,
                  Nome: true,
                  Precos: [
                    { order_by: [{ created_at: 'desc' }] },
                    { ValorBase: true }
                  ],
                  Planos: [
                    { where: { deleted_at: { _is_null: true } } },
                    {
                      Id: true,
                      ValorPraticado: true,
                      PlanoPreco: {
                        Id: true,
                        ValorBase: true,
                        ValorPraticado: true,
                        ServicoPreco: {
                          Id: true,
                          Valor: true
                        }
                      },
                      Plano: {
                        Nome: true
                      }
                    }
                  ],
                  Produtos: [
                    { where: { deleted_at: { _is_null: true } } },
                    {
                      Id: true,
                      ValorPraticado: true,
                      Produto: {
                        Id: true,
                        Nome: true
                      }
                    }
                  ],
                  Servicos: [
                    { where: { deleted_at: { _is_null: true } } },
                    {
                      Id: true,
                      ValorPraticado: true,
                      Servico: {
                        Id: true,
                        Nome: true
                      }
                    }
                  ],
                  OportunidadesDeProdutos: [
                    { where: { deleted_at: { _is_null: true } } },
                    {
                      Id: true,
                      Nome: true,
                      Valor: true
                    }
                  ],
                  OportunidadesDeServicos: [
                    { where: { deleted_at: { _is_null: true } } },
                    {
                      Id: true,
                      Nome: true,
                      Valor: true
                    }
                  ],
                  Combos: [
                    { where: { deleted_at: { _is_null: true } } },
                    {
                      Id: true,
                      Valor: true,
                      Combo: {
                        Planos: [
                          { where: { deleted_at: { _is_null: true } } },
                          {
                            Id: true,
                            Plano: {
                              Nome: true
                            }
                          }
                        ],
                        Produtos: [
                          { where: { deleted_at: { _is_null: true } } },
                          {
                            Id: true,
                            Produto: {
                              Id: true,
                              Nome: true
                            }
                          }
                        ],
                        Servicos: [
                          { where: { deleted_at: { _is_null: true } } },
                          {
                            Id: true,
                            Servico: {
                              Id: true,
                              Nome: true
                            }
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ],
            Planos: [
              { where: { Veiculo: { _eq: position } } },
              {
                Id: true,
                PlanoPreco: {
                  Id: true,
                  ValorBase: true,
                  ValorPraticado: true,
                  ServicoPreco: {
                    Id: true,
                    Valor: true
                  }
                },
                Veiculo: true,
                VeiculoRelacionamento: {
                  Id: true,
                  Placa: true,
                  NumeroDoChassi: true,
                  Categoria: {
                    Id: true,
                    Nome: true
                  }
                },
                Plano: {
                  Id: true,
                  Nome: true,
                  Precos: [
                    { order_by: [{ created_at: 'desc' }] },
                    {
                      ValorBase: true,
                      ValorPraticado: true,
                      ServicoPreco: {
                        Id: true,
                        Valor: true
                      }
                    }
                  ],
                  Servico: {
                    Nome: true
                  }
                }
              }
            ],
            Produtos: [
              { where: { Veiculo: { _eq: position } } },
              {
                Id: true,
                ProdutoPreco: {
                  Id: true,
                  Valor: true
                },
                Veiculo: true,
                VeiculoRelacionamento: {
                  Id: true,
                  Placa: true,
                  NumeroDoChassi: true,
                  Categoria: {
                    Id: true,
                    Nome: true
                  },
                  Apelido: true
                },
                Produto: {
                  Id: true,
                  Nome: true,
                  ProdutosQueDependo: [
                    {
                      where: {
                        deleted_at: { _is_null: true }
                      }
                    },
                    {
                      Id: true,
                      ProdutoDependente: { Nome: true }
                    }
                  ],
                  Servicos_Produtos: [
                    {
                      where: {
                        deleted_at: { _is_null: true }
                      }
                    },
                    {
                      Id: true,
                      Servico: {
                        Nome: true
                      }
                    }
                  ]
                }
              }
            ],
            Servicos: [
              { where: { Veiculo: { _eq: position } } },
              {
                Id: true,
                ServicosPreco: {
                  Id: true,
                  Valor: true
                },
                Veiculo: true,
                VeiculoRelacionamento: {
                  Id: true,
                  Placa: true,
                  NumeroDoChassi: true,
                  Categoria: {
                    Id: true,
                    Nome: true
                  },
                  Apelido: true
                },
                Servico: {
                  Id: true,
                  Nome: true,
                  Produtos_Servicos: [
                    {
                      where: {
                        deleted_at: { _is_null: true }
                      }
                    },
                    { Id: true, Produto: { Nome: true } }
                  ],
                  servicosServicos: [
                    {
                      where: {
                        deleted_at: { _is_null: true }
                      }
                    },
                    {
                      Id: true,
                      Servico: {
                        Nome: true
                      }
                    }
                  ]
                }
              }
            ],
            Oportunidades: [
              { where: { Veiculo: { _eq: position } } },
              {
                Id: true,
                Veiculo: true,
                VeiculoRelacionamento: {
                  Id: true,
                  Placa: true,
                  NumeroDoChassi: true,
                  Categoria: {
                    Id: true,
                    Nome: true
                  },
                  Apelido: true
                },
                OportunidadeDeProduto: {
                  Id: true,
                  Nome: true
                },
                OportunidadeDeServico: {
                  Id: true,
                  Nome: true
                }
              }
            ]
          }
        ]
      })
      return proposalArrayData.comercial_Propostas_by_pk
    }
  }

  async function getProposalInstallationByVehiclePosition(vehicle: number) {
    const { data } = await useTypedClientQuery({
      comercial_Propostas_Instalacoes: [
        {
          where: {
            Proposta_Id: { _eq: router.query.id },
            Veiculo: { _eq: vehicle }
          }
        },
        {
          Endereco: true,
          Veiculo: true,
          Veiculo_Id: true,
          Id: true
        }
      ]
    })
    return data?.comercial_Propostas_Instalacoes
  }

  const addressSchema = yup.object().shape({
    Cep: yup.string().required('Preencha o campo para continuar'),
    Numero: yup.string().required('Preencha o campo para continuar')
  })

  return (
    <ViewContext.Provider
      value={{
        proposalData: proposalData?.comercial_Propostas_by_pk,
        proposalRefetch,
        proposalLoading,
        proposalInstallationsData:
          proposalInstallationsData?.comercial_Propostas_Instalacoes,
        proposalInstallationsRefetch,
        proposalInstallationsLoading,
        slidePanelState,
        setSlidePanelState,
        getProposalArray,
        createProposalCombo,
        createProposalService,
        createProposalPlan,
        createProposalProduct,
        createProposalUpSelling,
        createProposalComboLoading,
        createProposalServiceLoading,
        createProposalPlanLoading,
        createProposalProductLoading,
        createProposalUpSellingLoading,
        createProposalInstalation,
        createProposalInstalationLoading,
        updateProposalInstalation,
        updateProposalInstalationLoading,
        acceptProposal,
        acceptProposalLoading,
        refuseProposal,
        refuseProposalLoading,
        addClientToProposal,
        addClientToProposalLoading,
        updateProposalCombo,
        updateProposalService,
        updateProposalPlan,
        updateProposalProduct,
        updateProposalUpSelling,
        updateProposalUpSellingLoading,
        updateProposalComboLoading,
        updateProposalServiceLoading,
        updateProposalPlanLoading,
        updateProposalProductLoading,
        deleteProposalCombo,
        deleteProposalService,
        deleteProposalPlan,
        deleteProposalProduct,
        deleteProposalUpSelling,
        deleteProposalServiceLoading,
        deleteProposalPlanLoading,
        deleteProposalProductLoading,
        deleteProposalUpSellingLoading,
        deleteProposalComboLoading,
        addressSchema,
        getProposalInstallationByVehiclePosition,
        deleteProposalInstalation,
        deleteProposalInstalationLoading
      }}
    >
      {children}
    </ViewContext.Provider>
  )
}

export const useView = () => {
  return useContext(ViewContext)
}
