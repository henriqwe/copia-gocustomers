import { useTypedQuery } from 'graphql/generated/zeus/apollo'
import { useRouter } from 'next/router'
import { createContext, ReactNode, useContext } from 'react'
import { $, useTypedMutation } from 'graphql/generated/zeus/apollo'
import {
  ApolloCache,
  DefaultContext,
  FetchResult,
  MutationFunctionOptions,
  OperationVariables
} from '@apollo/client'

type ViewContextProps = {
  comboData?: {
    Produtos: {
      Id: string
      ProdutoPreco: {
        Id: string
        Valor: string
      }
      ValorPraticado: string
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
        Fornecedores: {
          Id: string
          Precos: { Valor: string }[]
        }[]
      }
    }[]
    Id: string
    Nome: string
    Planos: {
      Id: string
      PlanoPreco: {
        Id: string
        ValorBase: string
        ValorPraticado?: string
        ServicoPreco: { Valor: string }
      }
      ValorPraticado: string
      Plano: {
        Nome: string
        Servico: {
          Nome: string
        }
        Precos: {
          Id: string
          ValorBase: string
          ValorPraticado?: string
        }[]
      }
    }[]
    Servicos: {
      Id: string
      ServicosPreco: {
        Id: string
        Valor: string
      }
      ValorPraticado: string
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

        Fornecedores: {
          Id: string
          Precos: { Valor: string }[]
        }[]
      }
    }[]
    Precos: { Id: string; ValorBase: string }[]
    Combos: { Id: string; Valor: string }[]
    ComboPai: { Id: string }[]
  }
  comboRefetch: () => void
  comboLoading: boolean
  createComboService: (
    options?: MutationFunctionOptions<
      {
        insert_comercial_Combos_Servicos_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createComboServiceLoading: boolean
  createComboPlan: (
    options?: MutationFunctionOptions<
      {
        insert_comercial_Combos_Planos_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createComboPlanLoading: boolean
  createComboProduct: (
    options?: MutationFunctionOptions<
      {
        insert_comercial_Combos_Produtos_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createComboProductLoading: boolean
  createComboPrice: (
    options?: MutationFunctionOptions<
      {
        insert_comercial_Combos_Precos_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createComboPriceLoading: boolean
  softDeleteComboPlan: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Combos_Planos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  softDeleteComboPlanLoading: boolean
  softDeleteComboProduct: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Combos_Produtos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  softDeleteComboProductLoading: boolean
  softDeleteComboService: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Combos_Servicos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  softDeleteComboServiceLoading: boolean
}

type ProviderProps = {
  children: ReactNode
}

export const ViewContext = createContext<ViewContextProps>(
  {} as ViewContextProps
)

export const ViewProvider = ({ children }: ProviderProps) => {
  const router = useRouter()
  const [createComboService, { loading: createComboServiceLoading }] =
    useTypedMutation({
      insert_comercial_Combos_Servicos_one: [
        {
          object: {
            Combo_Id: router.query.id,
            Servico_Id: $`Servico_Id`,
            ServicoPreco_Id: $`ServicoPreco_Id`,
            ValorPraticado: $`ValorPraticado`
          }
        },
        { Id: true }
      ]
    })

  const [createComboPlan, { loading: createComboPlanLoading }] =
    useTypedMutation({
      insert_comercial_Combos_Planos_one: [
        {
          object: {
            Combo_Id: router.query.id,
            Plano_Id: $`Plano_Id`,
            PlanoPreco_Id: $`PlanoPreco_Id`,
            ValorPraticado: $`ValorPraticado`
          }
        },
        { Id: true }
      ]
    })

  const [createComboProduct, { loading: createComboProductLoading }] =
    useTypedMutation({
      insert_comercial_Combos_Produtos_one: [
        {
          object: {
            Combo_Id: router.query.id,
            Produto_Id: $`Produto_Id`,
            ProdutoPreco_Id: $`ProdutoPreco_Id`,
            ValorPraticado: $`ValorPraticado`
          }
        },
        { Id: true }
      ]
    })

  const [createComboPrice, { loading: createComboPriceLoading }] =
    useTypedMutation({
      insert_comercial_Combos_Precos_one: [
        {
          object: {
            Combo_Id: router.query.id,
            ValorBase: $`ValorBase`
          }
        },
        { Id: true }
      ]
    })

  const [softDeleteComboPlan, { loading: softDeleteComboPlanLoading }] =
    useTypedMutation({
      update_comercial_Combos_Planos_by_pk: [
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

  const [softDeleteComboProduct, { loading: softDeleteComboProductLoading }] =
    useTypedMutation({
      update_comercial_Combos_Produtos_by_pk: [
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

  const [softDeleteComboService, { loading: softDeleteComboServiceLoading }] =
    useTypedMutation({
      update_comercial_Combos_Servicos_by_pk: [
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
    data: comboData,
    refetch: comboRefetch,
    loading: comboLoading
  } = useTypedQuery(
    {
      comercial_Combos_by_pk: [
        { Id: router.query.id },
        {
          Id: true,
          Nome: true,
          Planos: [
            {
              where: { deleted_at: { _is_null: true } }
            },
            {
              Id: true,
              PlanoPreco: {
                Id: true,
                ValorBase: true,
                ValorPraticado: true,
                ServicoPreco: { Valor: true }
              },
              ValorPraticado: true,
              Plano: {
                Nome: true,
                Servico: {
                  Nome: true
                },
                Precos: [
                  { order_by: [{ created_at: 'desc' }] },
                  {
                    Id: true,
                    ValorBase: true,
                    ValorPraticado: true
                  }
                ]
              }
            }
          ],
          Produtos: [
            {
              where: { deleted_at: { _is_null: true } }
            },
            {
              Id: true,
              ProdutoPreco: {
                Id: true,
                Valor: true
              },
              ValorPraticado: true,
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
                ],
                Fornecedores: [
                  {},
                  {
                    Id: true,
                    Precos: [
                      { order_by: [{ created_at: 'desc' }] },
                      { Valor: true }
                    ]
                  }
                ]
              }
            }
          ],
          Servicos: [
            {
              where: { deleted_at: { _is_null: true } }
            },
            {
              Id: true,
              ServicosPreco: {
                Id: true,
                Valor: true
              },
              ValorPraticado: true,
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
                ],
                Fornecedores: [
                  {},
                  {
                    Id: true,
                    Precos: [
                      { order_by: [{ created_at: 'desc' }] },
                      { Valor: true }
                    ]
                  }
                ]
              }
            }
          ],
          Precos: [
            {
              where: { Combo_Id: { _eq: router.query.id } },
              order_by: [{ created_at: 'desc' }]
            },
            { Id: true, ValorBase: true }
          ],
          Combos: [
            { where: { deleted_at: { _is_null: true } } },
            { Id: true, Valor: true }
          ],
          ComboPai: [
            { where: { deleted_at: { _is_null: true } } },
            { Id: true }
          ]
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  return (
    <ViewContext.Provider
      value={{
        comboData: comboData?.comercial_Combos_by_pk,
        comboRefetch,
        comboLoading,
        createComboService,
        createComboServiceLoading,
        createComboPlan,
        createComboPlanLoading,
        createComboProduct,
        createComboProductLoading,
        createComboPrice,
        createComboPriceLoading,
        softDeleteComboPlan,
        softDeleteComboPlanLoading,
        softDeleteComboProduct,
        softDeleteComboProductLoading,
        softDeleteComboService,
        softDeleteComboServiceLoading
      }}
    >
      {children}
    </ViewContext.Provider>
  )
}

export const useView = () => {
  return useContext(ViewContext)
}
