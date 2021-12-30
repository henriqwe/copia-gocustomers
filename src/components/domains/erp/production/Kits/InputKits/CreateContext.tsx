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
  useTypedQuery,
  useTypedClientQuery
} from 'graphql/generated/zeus/apollo'
import { createContext, ReactNode, useContext } from 'react'

type CreateContextProps = {
  createInputKit: (
    options?: MutationFunctionOptions<
      {
        insert_producao_KitsDeInsumo_one?: {
          Id: string
        }
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
  createInputKitLoading: boolean
  configData?: {
    Valor: string[]
  }
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
      Movimentacoes: {
        Tipo: string
        Quantidade: number
      }[]
      Grupo: {
        Nome: string
      }
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
  const [createInputKit, { loading: createInputKitLoading }] = useTypedMutation(
    {
      insert_producao_KitsDeInsumo_one: [
        {
          object: {
            Item_Id: $`Item_Id`,
            Tipo_Id: $`Tipo_Id`,
            Itens: {
              data: $`data`
            }
          }
        },
        { Id: true }
      ],
      insert_movimentacoes_Movimentacoes: [
        {
          objects: $`dataMovimentacao`
        },
        {
          returning: { Id: true }
        }
      ]
    }
  )

  const { data: configData } = useTypedQuery(
    {
      Configuracoes_by_pk: [
        { Slug: 'familiaKitsDeInsumo' },
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
          Movimentacoes: [{}, { Tipo: true, Quantidade: true }],
          Grupo: {
            Nome: true
          },
          Familia: { Nome: true }
        }
      ]
    })

    return itensPerFamily.estoque_Itens
  }

  return (
    <CreateContext.Provider
      value={{
        createInputKit,
        createInputKitLoading,
        configData: configData?.Configuracoes_by_pk,
        getItensPerFamily
      }}
    >
      {children}
    </CreateContext.Provider>
  )
}

export const useCreate = () => {
  return useContext(CreateContext)
}
