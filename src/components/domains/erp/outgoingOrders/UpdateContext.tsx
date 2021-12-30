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
  declineOutgoingOrder: (
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
  declineOutgoingOrderLoading: boolean
  authorizeOutgoingOrderLoading: boolean
  authorizeOutgoingOrder: (
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
  receiveOutgoingOrder: (
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
  receiveOutgoingOrderLoading: boolean
  authorizeOutgoingOrderProducts: (
    options?: MutationFunctionOptions<
      {
        update_pedidosDeSaida_Produtos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  authorizeOutgoingOrderProductsLoading: boolean
  receiveOutgoingOrderProducts: (
    options?: MutationFunctionOptions<
      {
        update_pedidosDeSaida_Produtos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  receiveOutgoingOrderProductsLoading: boolean
  outgoingOrderProductsData?: {
    Id: string
    Produto: {
      Id: string
      Nome: string
      UnidadeDeMedida_Id: string
    }
    QuantidadeAutorizada?: number
    QuantidadeEntregue?: number
    QuantidadePedida: number
    QuantidadeRecebida?: number
    Fabricante?: {
      Id: string
      Nome: string
    }
  }[]
  outgoingOrderProductsLoading: boolean
  outgoingOrderProductsRefetch: () => void

  declineSchema: any
  outgoingOrderData?: {
    Id: string
    Situacao: {
      Comentario: string
      Valor: string
    }
    DataEntregue?: Date
    MotivoRecusado?: string | undefined
    DataAbertura: Date
    DataAutorizacao?: Date
    DataRecebido?: Date
  }

  outgoingOrderLoading: boolean
  outgoingOrderRefetch: () => void
  authorizedOutgoingOrderProductsData?: {
    Id: string
    Produto: {
      Id: string
      Nome: string
      UnidadeDeMedida_Id: string
    }
    QuantidadeAutorizada?: number
    QuantidadeEntregue?: number
    QuantidadePedida: number
    QuantidadeRecebida?: number
  }[]
  authorizedOutgoingOrderProductsLoading: boolean
  authorizedOutgoingOrderProductsRefetch: () => void
  outgoingOrderLogsData?: {
    Id: string
    Operacao: string
    created_at: string
  }[]

  outgoingOrderLogsLoading: boolean
  outgoingOrderLogsRefetch: () => void
}

type SlidePanelStateType = {
  type: 'authorize' | 'receive' | 'deliver' | 'decline'
  data?: GraphQLTypes['pedidosDeCompra_Pedidos']
  open: boolean
  showModal: boolean
}

type ProviderProps = {
  children: ReactNode
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
  const [buttonName, setButtonName] = useState('')
  const { query } = useRouter()

  const [declineOutgoingOrder, { loading: declineOutgoingOrderLoading }] =
    useTypedMutation({
      update_pedidosDeSaida_Pedidos_by_pk: [
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

  const [authorizeOutgoingOrder, { loading: authorizeOutgoingOrderLoading }] =
    useTypedMutation({
      update_pedidosDeSaida_Pedidos_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            DataAutorizacao: new Date(),
            Situacao_Id: 'autorizado',
            updated_at: new Date()
          }
        },
        {
          Id: true
        }
      ]
    })

  const [receiveOutgoingOrder, { loading: receiveOutgoingOrderLoading }] =
    useTypedMutation({
      update_pedidosDeSaida_Pedidos_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            DataRecebido: new Date(),
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
    authorizeOutgoingOrderProducts,
    { loading: authorizeOutgoingOrderProductsLoading }
  ] = useTypedMutation({
    update_pedidosDeSaida_Produtos_by_pk: [
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

  const [
    receiveOutgoingOrderProducts,
    { loading: receiveOutgoingOrderProductsLoading }
  ] = useTypedMutation({
    update_pedidosDeSaida_Produtos_by_pk: [
      {
        pk_columns: { Id: $`Id` },
        _set: {
          QuantidadeRecebida: $`QuantidadeRecebida`
        }
      },
      {
        Id: true
      }
    ]
  })

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
            deleted_at: { _is_null: true }
          }
        },
        {
          Id: true,
          Produto: {
            Id: true,
            Nome: true,
            UnidadeDeMedida_Id: true
          },
          QuantidadeAutorizada: true,
          QuantidadeEntregue: true,
          QuantidadePedida: true,
          QuantidadeRecebida: true,
          Fabricante: {
            Id: true,
            Nome: true
          }
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const {
    data: authorizedOutgoingOrderProductsData,
    loading: authorizedOutgoingOrderProductsLoading,
    refetch: authorizedOutgoingOrderProductsRefetch
  } = useTypedQuery(
    {
      pedidosDeSaida_Produtos: [
        {
          where: {
            Pedido_Id: { _eq: query.id },
            deleted_at: { _is_null: true },
            Autorizado: { _eq: true }
          }
        },
        {
          Id: true,
          Produto: {
            Id: true,
            Nome: true,
            UnidadeDeMedida_Id: true
          },
          QuantidadeAutorizada: true,
          QuantidadeEntregue: true,
          QuantidadePedida: true,
          QuantidadeRecebida: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const {
    data: outgoingOrderData,
    loading: outgoingOrderLoading,
    refetch: outgoingOrderRefetch
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
          DataEntregue: true,
          MotivoRecusado: true,
          DataAbertura: true,
          DataAutorizacao: true,
          DataRecebido: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const {
    data: outgoingOrderLogsData,
    loading: outgoingOrderLogsLoading,
    refetch: outgoingOrderLogsRefetch
  } = useTypedQuery(
    {
      pedidosDeSaida_Logs: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { Tipo: { _eq: 'Pedidos' }, Tipo_Id: { _eq: query.id } }
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

  const declineSchema = yup.object().shape({
    MotivoRecusado: yup.string().required('Preencha o campo para continuar')
  })

  return (
    <UpdateContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        buttonName,
        setButtonName,
        declineOutgoingOrder,
        declineOutgoingOrderLoading,
        authorizeOutgoingOrder,
        authorizeOutgoingOrderLoading,
        receiveOutgoingOrder,
        receiveOutgoingOrderLoading,
        authorizeOutgoingOrderProducts,
        authorizeOutgoingOrderProductsLoading,
        receiveOutgoingOrderProducts,
        receiveOutgoingOrderProductsLoading,
        outgoingOrderData: outgoingOrderData?.pedidosDeSaida_Pedidos_by_pk,
        outgoingOrderLoading,
        outgoingOrderRefetch,
        outgoingOrderProductsData:
          outgoingOrderProductsData?.pedidosDeSaida_Produtos,
        outgoingOrderProductsLoading,
        outgoingOrderProductsRefetch,
        authorizedOutgoingOrderProductsData:
          authorizedOutgoingOrderProductsData?.pedidosDeSaida_Produtos,
        authorizedOutgoingOrderProductsLoading,
        authorizedOutgoingOrderProductsRefetch,
        outgoingOrderLogsData: outgoingOrderLogsData?.pedidosDeSaida_Logs,
        outgoingOrderLogsLoading,
        outgoingOrderLogsRefetch,
        declineSchema
      }}
    >
      {children}
    </UpdateContext.Provider>
  )
}

export const useUpdate = () => {
  return useContext(UpdateContext)
}
