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
  useTypedClientQuery
} from 'graphql/generated/zeus/apollo'
import { createContext, ReactNode, useContext } from 'react'
import * as yup from 'yup'

type CreateContextProps = {
  createItem: (
    options?: MutationFunctionOptions<
      {
        insert_estoque_Itens_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createItemLoading: boolean
  searchModel: (
    Produto_Id: string,
    Fabricante_Id: string
  ) => Promise<
    {
      Id: string
      Nome: string
    }[]
  >

  itemSchema: any
}

type ProviderProps = {
  children: ReactNode
}

export const CreateContext = createContext<CreateContextProps>(
  {} as CreateContextProps
)

export const CreateProvider = ({ children }: ProviderProps) => {
  const [createItem, { loading: createItemLoading }] = useTypedMutation({
    insert_estoque_Itens_one: [
      {
        object: {
          Classificacao: $`Classificacao`,
          Criticidade: $`Criticidade`,
          EstoqueMinimo: $`EstoqueMinimo`,
          Fabricante_Id: $`Fabricante_Id`,
          Enderecamento_Id: $`Enderecamento_Id`,
          Familia_Id: $`Familia_Id`,
          Grupo_Id: $`Grupo_Id`,
          Produto_Id: $`Produto_Id`,
          Modelo_Id: $`Modelo_Id`
        }
      },
      { Id: true }
    ]
  })

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
    Modelo: yup.object().required('Selecione um campo para continuar'),
    Enderecamento: yup.object().required('Selecione um campo para continuar')
  })

  return (
    <CreateContext.Provider
      value={{
        createItem,
        createItemLoading,
        searchModel,
        itemSchema
      }}
    >
      {children}
    </CreateContext.Provider>
  )
}

export const useCreate = () => {
  return useContext(CreateContext)
}
