import {
  ApolloCache,
  DefaultContext,
  FetchResult,
  MutationFunctionOptions,
  OperationVariables
} from '@apollo/client'
import {
  useTypedMutation,
  useTypedQuery,
  $,
  useTypedClientQuery
} from 'graphql/generated/zeus/apollo'
import { useRouter } from 'next/router'
import { createContext, ReactNode, useContext } from 'react'

type ValidateContextProps = {
  authorizedPurchaseOrderProductsData?: {
    Id: string
    QuantidadePedida: number
    QuantidadeAutorizada?: number | undefined
    QuantidadeEntregue?: number | undefined
    QuantidadeComprada?: number | undefined
    Produto: {
      Id: string
      Nome: string
      UnidadeDeMedida_Id: string
    }
    Fabricante?: {
      Id: string
      Nome: string
    }
    Descricao?: string
  }[]
  authorizedPurchaseOrderProductsLoading: boolean
  authorizedPurchaseOrderProductsRefetch: () => void

  purchaseOrderData?: {
    Id: string
    Situacao: {
      Comentario: string
      Valor: string
    }
    DataAbertura: Date
    DataAutorizacao?: Date
    DataCompra?: Date
    DataEntrada?: Date
    DataEntregue?: Date
    DataOrcamento?: Date
    MotivoRecusado?: string | undefined
    TipoPagamento?: string | undefined
  }

  purchaseOrderLoading: boolean
  purchaseOrderRefetch: () => void
  validatePurchaseOrder: (
    options?: MutationFunctionOptions<
      {
        insert_movimentacoes_Movimentacoes_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  validatePurchaseOrderLoading: boolean
  finalizePurchaseOrder: (
    options?: MutationFunctionOptions<
      {
        update_pedidosDeCompra_Pedidos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  finalizePurchaseOrderLoading: boolean
  getItemById: (Id: string) => Promise<
    {
      Id: string
      Produto: {
        Id: string
        Nome: string
      }
      Fabricante: {
        Nome: string
      }
      Modelo?: {
        Nome: string
      }
      Grupo: { Nome: string }
      Familia: { Nome: string }
    }[]
  >
}

type ProviderProps = {
  children: ReactNode
}

export const ValidateContext = createContext<ValidateContextProps>(
  {} as ValidateContextProps
)

export const ValidateProvider = ({ children }: ProviderProps) => {
  const { query } = useRouter()

  const {
    data: authorizedPurchaseOrderProductsData,
    loading: authorizedPurchaseOrderProductsLoading,
    refetch: authorizedPurchaseOrderProductsRefetch
  } = useTypedQuery(
    {
      pedidosDeCompra_Produtos: [
        {
          where: {
            PedidoDeCompra_Id: { _eq: query.id },
            deleted_at: { _is_null: true },
            Autorizado: { _eq: true }
          }
        },
        {
          Id: true,
          Fabricante: {
            Id: true,
            Nome: true
          },
          QuantidadePedida: true,
          QuantidadeAutorizada: true,
          QuantidadeComprada: true,
          QuantidadeEntregue: true,
          Produto: {
            Id: true,
            Nome: true,
            UnidadeDeMedida_Id: true
          },
          Descricao: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const {
    data: purchaseOrderData,
    loading: purchaseOrderLoading,
    refetch: purchaseOrderRefetch
  } = useTypedQuery(
    {
      pedidosDeCompra_Pedidos_by_pk: [
        {
          Id: query.id
        },
        {
          Id: true,
          Situacao: {
            Comentario: true,
            Valor: true
          },
          DataAbertura: true,
          DataAutorizacao: true,
          DataCompra: true,
          DataEntrada: true,
          DataEntregue: true,
          DataOrcamento: true,
          MotivoRecusado: true,
          TipoPagamento: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const [validatePurchaseOrder, { loading: validatePurchaseOrderLoading }] =
    useTypedMutation({
      insert_movimentacoes_Movimentacoes_one: [
        {
          object: {
            Data: new Date(),
            Quantidade: $`Quantidade`,
            Tipo: 'entrada',
            Item_Id: $`Item_Id`,
            Motivo_Id: 'pedidoDeCompra',
            Valor: 0
          }
        },
        {
          Id: true
        }
      ]
    })

  async function getItemById(Id: string) {
    const { data } = await useTypedClientQuery({
      estoque_Itens: [
        { where: { Produto_Id: { _eq: Id } } },
        {
          Id: true,
          Produto: { Id: true, Nome: true },
          Fabricante: { Nome: true },
          Modelo: { Nome: true },
          Grupo: { Nome: true },
          Familia: { Nome: true }
        }
      ]
    })
    return data.estoque_Itens
  }

  const [finalizePurchaseOrder, { loading: finalizePurchaseOrderLoading }] =
    useTypedMutation({
      update_pedidosDeCompra_Pedidos_by_pk: [
        {
          pk_columns: { Id: query.id },
          _set: {
            DataEntrada: new Date(),
            updated_at: new Date(),
            Situacao_Id: 'finalizado'
          }
        },
        {
          Id: true
        }
      ]
    })
  return (
    <ValidateContext.Provider
      value={{
        purchaseOrderData: purchaseOrderData?.pedidosDeCompra_Pedidos_by_pk,
        purchaseOrderLoading,
        purchaseOrderRefetch,
        authorizedPurchaseOrderProductsData:
          authorizedPurchaseOrderProductsData?.pedidosDeCompra_Produtos,
        authorizedPurchaseOrderProductsLoading,
        authorizedPurchaseOrderProductsRefetch,
        validatePurchaseOrder,
        validatePurchaseOrderLoading,
        finalizePurchaseOrder,
        finalizePurchaseOrderLoading,
        getItemById
      }}
    >
      {children}
    </ValidateContext.Provider>
  )
}

export const useValidate = () => {
  return useContext(ValidateContext)
}
