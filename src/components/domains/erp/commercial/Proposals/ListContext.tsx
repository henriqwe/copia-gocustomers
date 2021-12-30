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

type ListContextProps = {
  proposalsData?: {
    Id: string
    Combos: {
      Id: string
      Combo: {
        Nome: string
      }
    }[]
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
    Lead: {
      Id: string
      Nome: string
    }
    Ticket: {
      Id: string
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
    Situacao: {
      Comentario: string
      Valor: string
    }
  }[]

  proposalsRefetch: () => void
  proposalsLoading: boolean
  softDeleteProposalLoading: boolean
  softDeleteProposal: (
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
}

type ProviderProps = {
  children: ReactNode
}

export const ListContext = createContext<ListContextProps>(
  {} as ListContextProps
)

export const ListProvider = ({ children }: ProviderProps) => {
  const [softDeleteProposal, { loading: softDeleteProposalLoading }] =
    useTypedMutation({
      update_comercial_Propostas_by_pk: [
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
    data: proposalsData,
    refetch: proposalsRefetch,
    loading: proposalsLoading
  } = useTypedQuery(
    {
      comercial_Propostas: [
        { where: { deleted_at: { _is_null: true } } },
        {
          Id: true,
          Combos: [
            {},
            {
              Id: true,
              Combo: {
                Nome: true
              }
            }
          ],
          Planos: [
            {},
            {
              Id: true,
              Plano: {
                Nome: true
              }
            }
          ],
          Produtos: [
            {},
            {
              Id: true,
              Produto: {
                Id: true,
                Nome: true
              }
            }
          ],
          Servicos: [
            {},
            {
              Id: true,
              Servico: {
                Id: true,
                Nome: true
              }
            }
          ],
          Lead: {
            Id: true,
            Nome: true
          },
          Ticket: {
            Id: true
          },
          TipoDePagamento: {
            Comentario: true,
            Valor: true
          },
          TipoDeRecorrencia: {
            Comentario: true,
            Valor: true
          },
          Situacao: {
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
          }
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  return (
    <ListContext.Provider
      value={{
        proposalsData: proposalsData?.comercial_Propostas,
        proposalsRefetch,
        proposalsLoading,
        softDeleteProposalLoading,
        softDeleteProposal
      }}
    >
      {children}
    </ListContext.Provider>
  )
}

export const useList = () => {
  return useContext(ListContext)
}
