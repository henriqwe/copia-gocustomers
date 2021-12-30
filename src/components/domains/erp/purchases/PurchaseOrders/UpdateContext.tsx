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

type UpdateContextProps = {
  buttonName: string
  setButtonName: Dispatch<SetStateAction<string>>
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  declinePurchaseOrder: (
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
  declinePurchaseOrderLoading: boolean
  budgetPurchaseOrder: (
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
  budgetPurchaseOrderLoading: boolean
  authorizePurchaseOrderLoading: boolean
  authorizePurchaseOrder: (
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
  authorizePurchaseOrderProductsLoading: boolean
  authorizePurchaseOrderProducts: (
    options?: MutationFunctionOptions<
      {
        update_pedidosDeCompra_Produtos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  buyPurchaseOrderProductsLoading: boolean
  buyPurchaseOrderProducts: (
    options?: MutationFunctionOptions<
      {
        update_pedidosDeCompra_Produtos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  buyPurchaseOrder: (
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
  buyPurchaseOrderLoading: boolean
  deliverPurchaseOrder: (
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
  deliverPurchaseOrderLoading: boolean
  deliverPurchaseOrderProducts: (
    options?: MutationFunctionOptions<
      {
        update_pedidosDeCompra_Produtos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  deliverPurchaseOrderProductsLoading: boolean
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
  purchaseOrderProductsData?: {
    Id: string
    QuantidadePedida: number
    QuantidadeAutorizada?: number | undefined
    QuantidadeEntregue?: number | undefined
    QuantidadeComprada?: number | undefined
    Produto: {
      Id: string
      Nome: string
      UnidadeDeMedida_Id: string
      Descricao: string
    }
    Descricao: string
    Fabricante?: {
      Id: string
      Nome: string
    }
  }[]
  purchaseOrderProductsLoading: boolean
  purchaseOrderProductsRefetch: () => void
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
      Descricao: string
    }
    Fabricante?: {
      Id: string
      Nome: string
    }
    Descricao?: string
  }[]
  authorizedPurchaseOrderProductsLoading: boolean
  authorizedPurchaseOrderProductsRefetch: () => void
  authorizeSchema: any
  declineSchema: any
  buySchema: any
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
  purchaseOrderLogsData?: {
    Id: string
    Operacao: string
    created_at: string
  }[]
  purchaseOrderLogsLoading: boolean
  purchaseOrderLogsRefetch: () => void
}

type ProviderProps = {
  children: ReactNode
}

type SlidePanelStateType = {
  type: 'authorize' | 'buy' | 'deliver' | 'decline'
  data?: GraphQLTypes['pedidosDeCompra_Pedidos']
  open: boolean
  showModal: boolean
}

export const UpdateContext = createContext<UpdateContextProps>(
  {} as UpdateContextProps
)

export const UpdateProvider = ({ children }: ProviderProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    type: 'authorize',
    open: false,
    showModal: false
  })
  const [buttonName, setButtonName] = useState('Informar compra')
  const { query } = useRouter()

  const [declinePurchaseOrder, { loading: declinePurchaseOrderLoading }] =
    useTypedMutation({
      update_pedidosDeCompra_Pedidos_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            Id: query.id,
            MotivoRecusado: $`MotivoRecusado`,
            Situacao_Id: 'recusado',
            updated_at: new Date()
          }
        },
        {
          Id: true
        }
      ]
    })

  const [budgetPurchaseOrder, { loading: budgetPurchaseOrderLoading }] =
    useTypedMutation({
      update_pedidosDeCompra_Pedidos_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            Id: query.id,
            DataOrcamento: new Date(),
            updated_at: new Date()
          }
        },
        {
          Id: true
        }
      ]
    })

  const [authorizePurchaseOrder, { loading: authorizePurchaseOrderLoading }] =
    useTypedMutation({
      update_pedidosDeCompra_Pedidos_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            Id: query.id,
            DataAutorizacao: new Date(),
            Situacao_Id: 'autorizado',
            updated_at: new Date()
          }
        },
        {
          Id: true
        }
      ],
      update_pedidosDeCompra_Orcamentos_by_pk: [
        {
          pk_columns: {
            Id: $`Orcamento_Id`
          },
          _set: {
            Aprovado: true
          }
        },
        {
          Id: true
        }
      ]
    })

  const [
    authorizePurchaseOrderProducts,
    { loading: authorizePurchaseOrderProductsLoading }
  ] = useTypedMutation({
    update_pedidosDeCompra_Produtos_by_pk: [
      {
        pk_columns: { Id: $`Id` },
        _set: {
          QuantidadeAutorizada: $`QuantidadeAutorizada`,
          Autorizado: $`Autorizado`
        }
      },
      {
        Id: true
      }
    ]
  })

  const [buyPurchaseOrder, { loading: buyPurchaseOrderLoading }] =
    useTypedMutation({
      update_pedidosDeCompra_Pedidos_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            Id: query.id,
            DataCompra: new Date(),
            TipoPagamento: $`TipoPagamento`,
            updated_at: new Date(),
            Situacao_Id: 'comprado'
          }
        },
        {
          Id: true
        }
      ]
    })

  const [
    buyPurchaseOrderProducts,
    { loading: buyPurchaseOrderProductsLoading }
  ] = useTypedMutation({
    update_pedidosDeCompra_Produtos_by_pk: [
      {
        pk_columns: { Id: $`Id` },
        _set: {
          QuantidadeComprada: $`QuantidadeComprada`
        }
      },
      {
        Id: true
      }
    ]
  })

  const [deliverPurchaseOrder, { loading: deliverPurchaseOrderLoading }] =
    useTypedMutation({
      update_pedidosDeCompra_Pedidos_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            Id: query.id,
            DataEntregue: new Date(),
            updated_at: new Date(),
            Situacao_Id: 'recebido'
          }
        },
        {
          Id: true
        }
      ]
    })

  const [
    deliverPurchaseOrderProducts,
    { loading: deliverPurchaseOrderProductsLoading }
  ] = useTypedMutation({
    update_pedidosDeCompra_Produtos_by_pk: [
      {
        pk_columns: { Id: $`Id` },
        _set: {
          QuantidadeEntregue: $`QuantidadeEntregue`
        }
      },
      {
        Id: true
      }
    ]
  })

  const [finalizePurchaseOrder, { loading: finalizePurchaseOrderLoading }] =
    useTypedMutation({
      update_pedidosDeCompra_Pedidos_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            Id: query.id,
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

  const {
    data: purchaseOrderProductsData,
    loading: purchaseOrderProductsLoading,
    refetch: purchaseOrderProductsRefetch
  } = useTypedQuery(
    {
      pedidosDeCompra_Produtos: [
        {
          where: {
            PedidoDeCompra_Id: { _eq: query.id },
            deleted_at: { _is_null: true }
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
            UnidadeDeMedida_Id: true,
            Descricao: true
          },
          Descricao: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

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
            UnidadeDeMedida_Id: true,
            Descricao: true
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

  const {
    data: purchaseOrderLogsData,
    loading: purchaseOrderLogsLoading,
    refetch: purchaseOrderLogsRefetch
  } = useTypedQuery(
    {
      pedidosDeCompra_Logs: [
        {
          order_by: [{ created_at: 'desc' }],
          where: {
            Tipo: { _eq: 'PedidosDeCompra' },
            Tipo_Id: { _eq: query.id }
          }
        },
        {
          Id: true,
          Operacao: true,
          created_at: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const authorizeSchema = yup.object().shape({
    Orcamento: yup.string().required('Preencha o campo para continuar')
  })

  const declineSchema = yup.object().shape({
    MotivoRecusado: yup.string().required('Preencha o campo para continuar')
  })

  const buySchema = yup.object().shape({
    TipoPagamento: yup.object().required('Preencha o campo para continuar')
  })

  return (
    <UpdateContext.Provider
      value={{
        buttonName,
        setButtonName,
        slidePanelState,
        setSlidePanelState,
        declinePurchaseOrder,
        declinePurchaseOrderLoading,
        budgetPurchaseOrder,
        budgetPurchaseOrderLoading,
        authorizePurchaseOrderLoading,
        authorizePurchaseOrder,
        authorizePurchaseOrderProducts,
        authorizePurchaseOrderProductsLoading,
        buyPurchaseOrder,
        buyPurchaseOrderLoading,
        buyPurchaseOrderProducts,
        buyPurchaseOrderProductsLoading,
        deliverPurchaseOrder,
        deliverPurchaseOrderLoading,
        deliverPurchaseOrderProducts,
        deliverPurchaseOrderProductsLoading,
        finalizePurchaseOrder,
        finalizePurchaseOrderLoading,
        purchaseOrderData: purchaseOrderData?.pedidosDeCompra_Pedidos_by_pk,
        purchaseOrderLoading,
        purchaseOrderRefetch,
        purchaseOrderProductsData:
          purchaseOrderProductsData?.pedidosDeCompra_Produtos,
        purchaseOrderProductsLoading,
        purchaseOrderProductsRefetch,
        authorizedPurchaseOrderProductsData:
          authorizedPurchaseOrderProductsData?.pedidosDeCompra_Produtos,
        authorizedPurchaseOrderProductsLoading,
        authorizedPurchaseOrderProductsRefetch,
        purchaseOrderLogsData: purchaseOrderLogsData?.pedidosDeCompra_Logs,
        purchaseOrderLogsLoading,
        purchaseOrderLogsRefetch,
        authorizeSchema,
        declineSchema,
        buySchema
      }}
    >
      {children}
    </UpdateContext.Provider>
  )
}

export const useUpdate = () => {
  return useContext(UpdateContext)
}
