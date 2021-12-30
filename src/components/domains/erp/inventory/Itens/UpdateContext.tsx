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
import { useRouter } from 'next/router'
import { createContext, ReactNode, useContext } from 'react'
import * as yup from 'yup'

type UpdateContextProps = {
  updateItemLoading: boolean
  updateItem: (
    options?: MutationFunctionOptions<
      {
        update_estoque_Itens_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>

  itemSchema: any
  itemData?: DadosDetalhes
  itemLoading: boolean
  itemRefetch: () => void
  logsItensData?: {
    Id: string
    Operacao: string
    created_at: Date
  }[]
  logsItensLoading: boolean
  logsItensRefetch: () => void
  searchModel: (
    Produto_Id: string,
    Fabricante_Id: string
  ) => Promise<
    {
      Id: string
      Nome: string
    }[]
  >
}

type DadosDetalhes = {
  Id: string
  Classificacao: string
  Criticidade: string
  EstoqueMinimo: number
  Enderecamento: {
    Id: string
    Nome: string
  }
  Enderecamento_Id: string
  Familia: {
    Id: string
    Nome: string
  }
  Grupo: {
    Id: string
    Nome: string
  }
  Produto: {
    Id: string
    Nome: string
    UnidadeDeMedida_Id: string
  }
  Fabricante: {
    Id: string
    Nome: string
  }
  Modelo?: {
    Id: string
    Nome: string
  }
}

type ProviderProps = {
  children: ReactNode
}

export const UpdateContext = createContext<UpdateContextProps>(
  {} as UpdateContextProps
)

export const UpdateProvider = ({ children }: ProviderProps) => {
  const { query } = useRouter()

  const [updateItem, { loading: updateItemLoading }] = useTypedMutation({
    update_estoque_Itens_by_pk: [
      {
        pk_columns: { Id: $`Id` },
        _set: {
          updated_at: new Date(),
          Classificacao: $`Classificacao`,
          Criticidade: $`Criticidade`,
          EstoqueMinimo: $`EstoqueMinimo`,

          Enderecamento_Id: $`Enderecamento_Id`,

          Familia_Id: $`Familia_Id`,
          Grupo_Id: $`Grupo_Id`,
          Produto_Id: $`Produto_Id`,
          Fabricante_Id: $`Fabricante_Id`
        }
      },
      {
        Id: true
      }
    ]
  })

  const {
    data: itemData,
    loading: itemLoading,
    refetch: itemRefetch
  } = useTypedQuery(
    {
      estoque_Itens_by_pk: [
        {
          Id: query.id
        },
        {
          Id: true,

          Classificacao: true,
          Criticidade: true,
          EstoqueMinimo: true,
          Enderecamento: {
            Id: true,
            Nome: true
          },
          Enderecamento_Id: true,

          Familia: {
            Id: true,
            Nome: true
          },
          Grupo: {
            Id: true,
            Nome: true
          },
          Fabricante: {
            Id: true,
            Nome: true
          },

          Produto: {
            Id: true,
            Nome: true,
            UnidadeDeMedida_Id: true
          },
          Modelo: {
            Id: true,
            Nome: true
          }
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const {
    data: logsItensData,
    loading: logsItensLoading,
    refetch: logsItensRefetch
  } = useTypedQuery(
    {
      estoque_Logs: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { Tipo: { _eq: 'Itens' }, Tipo_Id: { _eq: query.id } }
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

  async function searchModel(Produto_Id: string, Fabricante_Id: string) {
    const { data } = await useTypedClientQuery({
      estoque_Modelos: [
        {
          where: {
            deleted_at: { _is_null: true },
            Produto_Id: { _eq: Produto_Id },
            Fabricante_Id: { _eq: Fabricante_Id }
          }
        },
        {
          Id: true,
          Nome: true
        }
      ]
    })
    return data.estoque_Modelos
  }

  const itemSchema = yup.object().shape({
    Classificacao: yup.string().required('Preencha o campo para continuar'),
    Criticidade: yup.string().required('Preencha o campo para continuar'),
    EstoqueMinimo: yup
      .number()
      .required('Preencha o campo para continuar')
      .typeError('Preencha o campo para continuar'),

    Familia: yup.object().required('Selecione um campo para continuar'),
    Grupo: yup.object().required('Selecione um campo para continuar'),
    Produto: yup.object().required('Selecione um campo para continuar'),
    Fabricante: yup.object().required('Selecione um campo para continuar'),
    Enderecamento: yup.object().required('Selecione um campo para continuar'),
    Modelo: yup.object().required('Selecione um campo para continuar')
  })

  return (
    <UpdateContext.Provider
      value={{
        updateItemLoading,
        updateItem,
        itemSchema,
        itemData: itemData?.estoque_Itens_by_pk,
        itemLoading,
        itemRefetch,
        logsItensData: logsItensData?.estoque_Logs,
        logsItensLoading,
        logsItensRefetch,
        searchModel
      }}
    >
      {children}
    </UpdateContext.Provider>
  )
}

export const useUpdate = () => {
  return useContext(UpdateContext)
}
