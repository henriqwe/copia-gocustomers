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
  combosData?: {
    Produtos: {
      Id: string
      Produto: {
        Id: string
        Nome: string
      }
      ValorPraticado: string
    }[]
    Id: string
    Nome: string
    Planos: {
      Id: string
      Plano: {
        Nome: string
      }
      ValorPraticado: string
    }[]
    Servicos: {
      Id: string
      Servico: {
        Id: string
        Nome: string
      }
      ValorPraticado: string
    }[]
    OportunidadesDeProdutos: {
      Id: string
      Nome: string
      Valor: string
      Combo: {
        Id: string
        Nome: string
      }
    }[]
    OportunidadesDeServicos: {
      Id: string
      Nome: string
      Valor: string
      Combo: {
        Id: string
        Nome: string
      }
    }[]
    Precos: { Id: string; ValorBase: string }[]
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
  }[]

  combosRefetch: () => void
  combosLoading: boolean
  softDeleteComboLoading: boolean
  softDeleteCombo: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Combos_by_pk?: {
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
  const [softDeleteCombo, { loading: softDeleteComboLoading }] =
    useTypedMutation({
      update_comercial_Combos_by_pk: [
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
    data: combosData,
    refetch: combosRefetch,
    loading: combosLoading
  } = useTypedQuery(
    {
      comercial_Combos: [
        { where: { deleted_at: { _is_null: true } } },
        {
          Id: true,
          Nome: true,
          Planos: [
            { where: { deleted_at: { _is_null: true } } },
            {
              Id: true,
              Plano: {
                Nome: true
              },
              ValorPraticado: true
            }
          ],
          Produtos: [
            { where: { deleted_at: { _is_null: true } } },
            {
              Id: true,
              Produto: {
                Id: true,
                Nome: true
              },
              ValorPraticado: true
            }
          ],
          Servicos: [
            { where: { deleted_at: { _is_null: true } } },
            {
              Id: true,
              Servico: {
                Id: true,
                Nome: true
              },
              ValorPraticado: true
            }
          ],
          OportunidadesDeProdutos: [
            { where: { deleted_at: { _is_null: true } } },
            {
              Id: true,
              Nome: true,
              Valor: true,
              Combo: {
                Id: true,
                Nome: true
              }
            }
          ],
          OportunidadesDeServicos: [
            { where: { deleted_at: { _is_null: true } } },
            {
              Id: true,
              Nome: true,
              Valor: true,
              Combo: {
                Id: true,
                Nome: true
              }
            }
          ],
          Precos: [
            { order_by: [{ created_at: 'desc' }] },
            { Id: true, ValorBase: true }
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
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  return (
    <ListContext.Provider
      value={{
        combosData: combosData?.comercial_Combos,
        combosRefetch,
        combosLoading,
        softDeleteComboLoading,
        softDeleteCombo
      }}
    >
      {children}
    </ListContext.Provider>
  )
}

export const useList = () => {
  return useContext(ListContext)
}
