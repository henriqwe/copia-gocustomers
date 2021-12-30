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
import { useRouter } from 'next/router'
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState
} from 'react'
import * as yup from 'yup'

type BudgetContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  budgetsData?: {
    Id: string
    Fornecedor_Id: string
    Orcamentos_Produtos: {
      PedidosDeCompra_Produto_Id: string
      PedidosDeCompra_Produto: {
        Produto: {
          Nome: string
        }
      }
      Quantidade: number
      ValorUnitario: number
      Descricao?: string
    }[]
    Aprovado?: boolean
  }[]
  budgetsLoading: boolean
  budgetsRefetch: () => void
  budgetProductsData?: {
    Fabricante_Id?: string
    PedidosDeCompra_Produto: {
      Produto: {
        Nome: string
        Descricao?: string
      }
    }
    Fabricante?: {
      Id: string
      Nome: string
    }
    Quantidade: number
    ValorUnitario: number
    Descricao?: string
  }[]
  createBudget: (
    options?: MutationFunctionOptions<
      {
        insert_pedidosDeCompra_Orcamentos_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createBudgetLoading: boolean
  softDeleteBudget: (
    options?: MutationFunctionOptions<
      {
        update_pedidosDeCompra_Orcamentos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  budgetSchema: any
  SearchProvider: (Id: string) => Promise<
    | {
        Pessoa: {
          Nome: string
        }
      }
    | undefined
  >
  providersData?: {
    Id: string
    Pessoa: {
      Nome: string
    }
  }[]
}

type ProvedorProps = {
  children: ReactNode
}

type SlidePanelStateType = {
  type: 'authorize' | 'create' | 'view'
  data?: GraphQLTypes['pedidosDeCompra_Orcamentos']
  open: boolean
  showModal: boolean
}

export const BudgetContext = createContext<BudgetContextProps>(
  {} as BudgetContextProps
)

export const BudgetProvider = ({ children }: ProvedorProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    type: 'create',
    open: false,
    showModal: false
  })
  const { query } = useRouter()

  const {
    data: budgetsData,
    loading: budgetsLoading,
    refetch: budgetsRefetch
  } = useTypedQuery(
    {
      pedidosDeCompra_Orcamentos: [
        {
          order_by: [{ created_at: 'desc' }],
          where: {
            deleted_at: { _is_null: true },
            Pedido_Id: { _eq: query.id }
          }
        },
        {
          Id: true,
          Fornecedor_Id: true,
          Orcamentos_Produtos: [
            {},
            {
              Quantidade: true,
              PedidosDeCompra_Produto_Id: true,
              PedidosDeCompra_Produto: { Produto: { Nome: true } },
              ValorUnitario: true,
              Descricao: true
            }
          ],
          Aprovado: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const { data: budgetProductsData } = useTypedQuery(
    {
      pedidosDeCompra_Orcamentos_Produtos: [
        {
          where: {
            Orcamento_Id: { _eq: slidePanelState.data?.Id },
            deleted_at: { _is_null: true }
          }
        },
        {
          Fabricante_Id: true,
          PedidosDeCompra_Produto: {
            Produto: {
              Nome: true,
              Descricao: true
            }
          },
          Fabricante: {
            Id: true,
            Nome: true
          },
          Quantidade: true,
          ValorUnitario: true,
          Descricao: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const [createBudget, { loading: createBudgetLoading }] = useTypedMutation({
    insert_pedidosDeCompra_Orcamentos_one: [
      {
        object: {
          Fornecedor_Id: $`Fornecedor_Id`,
          Pedido_Id: query.id,
          Orcamentos_Produtos: {
            data: $`data`
          },
          Aprovado: false
        }
      },
      {
        Id: true
      }
    ]
  })

  const [softDeleteBudget] = useTypedMutation({
    update_pedidosDeCompra_Orcamentos_by_pk: [
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

  const budgetSchema = yup.object().shape({
    Fornecedor_Id: yup.object().required('Preencha o campo para continuar')
  })

  const { data: providersData } = useTypedQuery(
    {
      identidades_Fornecedores: [
        {
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          Pessoa: {
            Nome: true
          }
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const SearchProvider = async (Id: string) => {
    const { data } = await useTypedClientQuery({
      identidades_Fornecedores_by_pk: [
        {
          Id
        },
        {
          Pessoa: {
            Nome: true
          }
        }
      ]
    })
    return data?.identidades_Fornecedores_by_pk
  }

  return (
    <BudgetContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        budgetsData: budgetsData?.pedidosDeCompra_Orcamentos,
        budgetsLoading,
        budgetsRefetch,
        budgetProductsData:
          budgetProductsData?.pedidosDeCompra_Orcamentos_Produtos,
        createBudget,
        createBudgetLoading,
        softDeleteBudget,
        budgetSchema,
        SearchProvider,
        providersData: providersData?.identidades_Fornecedores
      }}
    >
      {children}
    </BudgetContext.Provider>
  )
}

export const useBudget = () => {
  return useContext(BudgetContext)
}
