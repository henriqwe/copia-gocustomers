import {
  ApolloCache,
  DefaultContext,
  FetchResult,
  MutationFunctionOptions,
  OperationVariables
} from '@apollo/client'
import {
  $,
  useTypedClientQuery,
  useTypedMutation,
  useTypedQuery
} from 'graphql/generated/zeus/apollo'
import { createContext, ReactNode, useContext } from 'react'

type CreateContextProps = {
  createTracker: (
    options?: MutationFunctionOptions<
      {
        insert_producao_Rastreadores?: {
          returning: {
            Id: string
          }[]
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createTrackerLoading: boolean
  getFilteredChips(): Promise<
    {
      Id: string
      Item: {
        Id: string
        Movimentacoes: {
          Tipo: string
          Quantidade: number
        }[]
      }
      Iccid: string
      Operadora: {
        Nome: string
      }
    }[]
  >
  getFilteredEquipments(): Promise<
    {
      Id: string
      Imei: string
      Item: {
        Id: string
        Produto: {
          Id: string
          Nome: string
        }
        Movimentacoes: {
          Tipo: string
          Quantidade: number
        }[]
      }
    }[]
  >
  configData?: {
    Valor: string[]
  }
  moveStock: (
    options?: MutationFunctionOptions<
      {
        insert_movimentacoes_Movimentacoes?: {
          returning: {
            Id: string
          }[]
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  getItensPerFamily: () => Promise<
    {
      Id: string
      Produto: {
        Id: string
        Nome: string
      }
      Fabricante: {
        Id: string
        Nome: string
      }
      Modelo?: {
        Id: string
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

export const CreateContext = createContext<CreateContextProps>(
  {} as CreateContextProps
)

export const CreateProvider = ({ children }: ProviderProps) => {
  const [createTracker, { loading: createTrackerLoading }] = useTypedMutation({
    insert_producao_Rastreadores: [
      {
        objects: $`data`
      },
      { returning: { Id: true } }
    ]
  })

  const [moveStock] = useTypedMutation({
    insert_movimentacoes_Movimentacoes: [
      {
        objects: [
          {
            Data: new Date(),
            Quantidade: 1,
            Tipo: 'entrada',
            Motivo_Id: 'criacaoDeRastreador',
            Item_Id: $`Item_Id`,
            Valor: 0
          },
          {
            Data: new Date(),
            Quantidade: 1,
            Tipo: 'saida',
            Motivo_Id: 'criacaoDeRastreador',
            Item_Id: $`ItemChip_Id`,
            Valor: 0
          },
          {
            Data: new Date(),
            Quantidade: 1,
            Tipo: 'saida',
            Motivo_Id: 'criacaoDeRastreador',
            Item_Id: $`ItemEquipamento_Id`,
            Valor: 0
          }
        ]
      },
      {
        returning: { Id: true }
      }
    ],
    update_producao_Chips_by_pk: [
      {
        pk_columns: { Id: $`Chip_Id` },
        _set: { updated_at: new Date(), Situacao_Id: 'ativo' }
      },
      {
        Id: true
      }
    ]
  })

  const { data: configData } = useTypedQuery(
    {
      Configuracoes_by_pk: [
        { Slug: 'familiaRastreadores' },
        {
          Valor: [{}, true]
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  async function getItensPerFamily() {
    const { data: itensPerFamily } = await useTypedClientQuery({
      estoque_Itens: [
        {
          where: {
            deleted_at: { _is_null: true },
            Familia: {
              Pai: {
                Id: { _eq: configData?.Configuracoes_by_pk?.Valor[0] }
              }
            }
            // { Familia_Id: { _eq: Id } },
          }
        },
        {
          Id: true,
          Produto: {
            Id: true,
            Nome: true
          },
          Fabricante: {
            Id: true,
            Nome: true
          },
          Modelo: {
            Id: true,
            Nome: true
          },
          Grupo: { Nome: true },
          Familia: { Nome: true }
        }
      ]
    })

    return itensPerFamily.estoque_Itens
  }

  async function getFilteredEquipments() {
    const { data: equipmentsData } = await useTypedClientQuery({
      producao_Equipamentos: [
        {
          where: {
            deleted_at: { _is_null: true },
            _not: { Rastreador: {} }
          }
        },
        {
          Id: true,
          Imei: true,
          Item: {
            Id: true,
            Produto: {
              Id: true,
              Nome: true
            },
            Movimentacoes: [{}, { Tipo: true, Quantidade: true }]
          }
        }
      ]
    })

    const filteredEquipments = equipmentsData.producao_Equipamentos.filter(
      (equipment) => {
        let balance = 0
        equipment.Item.Movimentacoes.map((move) => {
          if (move.Tipo === 'saida') {
            balance = balance - move.Quantidade
            return
          }
          balance = balance + move.Quantidade
        })
        return balance > 0
      }
    )

    return filteredEquipments
  }

  async function getFilteredChips() {
    const { data: chipsData } = await useTypedClientQuery({
      producao_Chips: [
        {
          where: {
            deleted_at: { _is_null: true },
            Situacao: { Valor: { _eq: 'inativo' } }
          }
        },
        {
          Id: true,
          Operadora: {
            Nome: true
          },
          Item: {
            Id: true,
            Movimentacoes: [{}, { Quantidade: true, Tipo: true }]
          },
          Iccid: true
        }
      ]
    })

    const filteredChips = chipsData.producao_Chips.filter((chips) => {
      let balance = 0
      chips?.Item.Movimentacoes.map((move) => {
        if (move.Tipo === 'saida') {
          balance = balance - move.Quantidade
          return
        }
        balance = balance + move.Quantidade
      })
      return balance > 0
    })

    return filteredChips
  }

  return (
    <CreateContext.Provider
      value={{
        createTracker,
        createTrackerLoading,
        moveStock,
        getFilteredEquipments,
        configData: configData?.Configuracoes_by_pk,
        getItensPerFamily,
        getFilteredChips
      }}
    >
      {children}
    </CreateContext.Provider>
  )
}

export const useCreate = () => {
  return useContext(CreateContext)
}
