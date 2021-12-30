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
  createInstallationKit: (
    options?: MutationFunctionOptions<
      {
        insert_producao_KitsDeInstalacao?: {
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
  createInstallationKitLoading: boolean
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
      Grupo: {
        Nome: string
      }
      Familia: { Nome: string }
    }[]
  >
  kitsTypesData?: {
    Id: string
    Nome: string
  }[]
  getInputKitByType(Tipo_Id: string): Promise<
    {
      Id: string
      CodigoReferencia: number
      Itens: {
        Id: string
        Item: {
          Id: string
        }
      }[]
      TiposDeKitDeInsumo: {
        Id: string
        Nome: string
      }
      Item: {
        Id: string
        Produto: {
          Nome: string
        }
        Movimentacoes: { Tipo: string; Quantidade: number }[]
      }
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
  const [createInstallationKit, { loading: createInstallationKitLoading }] =
    useTypedMutation({
      insert_producao_KitsDeInstalacao: [
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
            Motivo_Id: 'criacaoDeKitDeInstalacao',
            Item_Id: $`Item_Id`,
            Valor: 0
          },
          {
            Data: new Date(),
            Quantidade: 1,
            Tipo: 'saida',
            Motivo_Id: 'criacaoDeKitDeInstalacao',
            Item_Id: $`ItemRastreador_Id`,
            Valor: 0
          },
          {
            Data: new Date(),
            Quantidade: 1,
            Tipo: 'saida',
            Motivo_Id: 'criacaoDeKitDeInstalacao',
            Item_Id: $`ItemKitDeInsumo_Id`,
            Valor: 0
          }
        ]
      },
      {
        returning: { Id: true }
      }
    ]
  })

  const { data: kitsTypesData } = useTypedQuery(
    {
      producao_TiposDeKitDeInsumo: [
        {
          where: {
            deleted_at: { _is_null: true },
            KitsDeInsumo: { Id: { _is_null: false } }
          }
        },
        {
          Id: true,
          Nome: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const { data: configData } = useTypedQuery(
    {
      Configuracoes_by_pk: [
        { Slug: 'familiaKitsDeInstalacao' },
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
          Grupo: {
            Nome: true
          },
          Familia: { Nome: true }
        }
      ]
    })

    return itensPerFamily.estoque_Itens
  }

  async function getInputKitByType(Tipo_Id: string) {
    const { data: inputKitData } = await useTypedClientQuery({
      producao_KitsDeInsumo: [
        {
          where: { deleted_at: { _is_null: true }, Tipo_Id: { _eq: Tipo_Id } }
        },
        {
          Id: true,
          CodigoReferencia: true,
          Itens: [{}, { Id: true, Item: { Id: true } }],
          TiposDeKitDeInsumo: {
            Id: true,
            Nome: true
          },
          Item: {
            Id: true,
            Produto: { Nome: true },
            Movimentacoes: [{}, { Tipo: true, Quantidade: true }]
          }
        }
      ]
    })

    return inputKitData.producao_KitsDeInsumo
  }

  return (
    <CreateContext.Provider
      value={{
        createInstallationKit,
        createInstallationKitLoading,
        moveStock,
        configData: configData?.Configuracoes_by_pk,
        getItensPerFamily,
        kitsTypesData: kitsTypesData?.producao_TiposDeKitDeInsumo,
        getInputKitByType
      }}
    >
      {children}
    </CreateContext.Provider>
  )
}

export const useCreate = () => {
  return useContext(CreateContext)
}
