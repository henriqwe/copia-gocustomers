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
  useTypedClientQuery,
  useTypedQuery
} from 'graphql/generated/zeus/apollo'
import { createContext, ReactNode, useContext } from 'react'

type CreateContextProps = {
  createIdentifier: (
    options?: MutationFunctionOptions<
      {
        insert_producao_Identificadores?: {
          returning: {
            Id: string
          }[]
        }

        insert_movimentacoes_Movimentacoes_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createIdentifierLoading: boolean
  getItemAmount: (id: string) => Promise<number>
  getItemByFamily: () => Promise<
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
  configData?: {
    Valor: string[]
  }
}

type ProviderProps = {
  children: ReactNode
}

export const CreateContext = createContext<CreateContextProps>(
  {} as CreateContextProps
)

export const CreateProvider = ({ children }: ProviderProps) => {
  const [createIdentifier, { loading: createIdentifierLoading }] =
    useTypedMutation({
      insert_producao_Identificadores: [
        {
          objects: $`data`
        },
        { returning: { Id: true } }
      ],
      insert_movimentacoes_Movimentacoes_one: [
        {
          object: {
            Data: new Date(),
            Quantidade: $`Quantidade`,
            Tipo: 'saida',
            Item_Id: $`Item_Id`,
            Motivo_Id: 'criacaoDeIdentificador',
            Valor: 0
          }
        },
        { Id: true }
      ]
    })

  const { data: configData } = useTypedQuery(
    {
      Configuracoes_by_pk: [
        { Slug: 'familiaIdentificadores' },
        {
          Valor: [{}, true]
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  async function getItemByFamily() {
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

  async function getItemAmount(id: string) {
    let amount = 0
    const { data } = await useTypedClientQuery({
      movimentacoes_Movimentacoes: [
        { where: { Item_Id: { _eq: id } } },
        {
          Quantidade: true,
          Tipo: true
        }
      ]
    })
    data.movimentacoes_Movimentacoes.map((item) => {
      if (item.Tipo === 'saida') {
        amount = amount - item.Quantidade
        return
      }
      amount = amount + item.Quantidade
    })
    return amount
  }

  return (
    <CreateContext.Provider
      value={{
        createIdentifier,
        createIdentifierLoading,
        getItemAmount,
        getItemByFamily,
        configData: configData?.Configuracoes_by_pk
      }}
    >
      {children}
    </CreateContext.Provider>
  )
}

export const useCreate = () => {
  return useContext(CreateContext)
}
