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
  outgoingOrderProductsData?: {
    Id: string
    QuantidadeAutorizada?: number | undefined
    QuantidadeEntregue?: number | undefined
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
  outgoingOrderProductsLoading: boolean
  outgoingOrderProductsRefetch: () => void

  outgoingOrdersData?: {
    Id: string
    Situacao: {
      Comentario: string
      Valor: string
    }
    DataAutorizacao?: Date
    MotivoRecusado?: string | undefined
  }

  outgoingOrdersLoading: boolean
  outgoingOrdersRefetch: () => void
  validateOutgoingOrder: (
    options?: MutationFunctionOptions<
      {
        insert_movimentacoes_Movimentacoes_one?: {
          Id: string
        }

        update_pedidosDeSaida_Produtos_by_pk?: {
          Id: string
          Descricao: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  validateOutgoingOrderLoading: boolean
  deliverOutgoindOrder: (
    options?: MutationFunctionOptions<
      {
        update_pedidosDeSaida_Pedidos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  deliverOutgoindOrderLoading: boolean
  GetItemByProductId: (Id: string) => Promise<
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
  getItemAmount: (id: string) => Promise<number>
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
    data: outgoingOrderProductsData,
    loading: outgoingOrderProductsLoading,
    refetch: outgoingOrderProductsRefetch
  } = useTypedQuery(
    {
      pedidosDeSaida_Produtos: [
        {
          where: {
            Pedido_Id: { _eq: query.id },
            deleted_at: { _is_null: true },
            Autorizado: { _eq: true },
            QuantidadeEntregue: { _is_null: true }
          }
        },
        {
          Id: true,
          Fabricante: {
            Id: true,
            Nome: true
          },
          QuantidadeAutorizada: true,
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
    data: outgoingOrdersData,
    loading: outgoingOrdersLoading,
    refetch: outgoingOrdersRefetch
  } = useTypedQuery(
    {
      pedidosDeSaida_Pedidos_by_pk: [
        {
          Id: query.id
        },
        {
          Id: true,
          Situacao: {
            Comentario: true,
            Valor: true
          },
          DataAutorizacao: true,
          MotivoRecusado: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const [validateOutgoingOrder, { loading: validateOutgoingOrderLoading }] =
    useTypedMutation({
      insert_movimentacoes_Movimentacoes_one: [
        {
          object: {
            Data: new Date(),
            Quantidade: $`Quantidade`,
            Tipo: 'saida',
            Item_Id: $`Item_Id`,
            Motivo_Id: $`Motivo`,
            Valor: 0
          }
        },
        {
          Id: true
        }
      ],
      update_pedidosDeSaida_Produtos_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            QuantidadeEntregue: $`Quantidade`
          }
        },
        {
          Id: true,
          Descricao: true
        }
      ]
    })

  const [deliverOutgoindOrder, { loading: deliverOutgoindOrderLoading }] =
    useTypedMutation({
      update_pedidosDeSaida_Pedidos_by_pk: [
        {
          pk_columns: { Id: query.id },
          _set: {
            DataEntregue: new Date(),
            updated_at: new Date(),
            Situacao_Id: $`Situacao`
          }
        },
        {
          Id: true
        }
      ]
    })

  async function GetItemByProductId(Id: string) {
    const { data } = await useTypedClientQuery(
      {
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
      },
      { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
    )
    return data.estoque_Itens
  }

  async function getItemAmount(id: string) {
    let quantidade = 0

    const { data } = await useTypedClientQuery(
      {
        movimentacoes_Movimentacoes: [
          { where: { Item_Id: { _eq: id } } },
          {
            Quantidade: true,
            Tipo: true
          }
        ]
      },
      { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
    )
    data.movimentacoes_Movimentacoes.map((item) => {
      if (item.Tipo === 'saida') {
        quantidade = quantidade - item.Quantidade
        return
      }
      quantidade = quantidade + item.Quantidade
    })
    return quantidade
  }

  return (
    <ValidateContext.Provider
      value={{
        outgoingOrdersData: outgoingOrdersData?.pedidosDeSaida_Pedidos_by_pk,
        outgoingOrdersLoading,
        outgoingOrdersRefetch,
        outgoingOrderProductsData:
          outgoingOrderProductsData?.pedidosDeSaida_Produtos,
        outgoingOrderProductsLoading,
        outgoingOrderProductsRefetch,
        validateOutgoingOrder,
        validateOutgoingOrderLoading,
        deliverOutgoindOrder,
        deliverOutgoindOrderLoading,
        GetItemByProductId,
        getItemAmount
      }}
    >
      {children}
    </ValidateContext.Provider>
  )
}

export const useValidate = () => {
  return useContext(ValidateContext)
}
