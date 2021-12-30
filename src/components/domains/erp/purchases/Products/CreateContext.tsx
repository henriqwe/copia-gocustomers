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
  useTypedQuery
} from 'graphql/generated/zeus/apollo'
import { createContext, ReactNode, useContext } from 'react'
import * as yup from 'yup'

type CreateContextProps = {
  createProduct: (
    options?: MutationFunctionOptions<
      {
        insert_Produtos_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createProductLoading: boolean

  productSchema: any
  unitsOfMeasureData?: {
    UnidadesDeMedidas: {
      Valor: string
      Comentario: string
    }[]
  }
}

type ProviderProps = {
  children: ReactNode
}

export const CreateContext = createContext<CreateContextProps>(
  {} as CreateContextProps
)

export const CreateProvider = ({ children }: ProviderProps) => {
  const [createProduct, { loading: createProductLoading }] = useTypedMutation({
    insert_Produtos_one: [
      {
        object: {
          Nome: $`Nome`,
          // Descricao: $`Descricao`,
          UnidadeDeMedida_Id: $`UnidadeDeMedida_Id`,
          Utilizacao: $`Utilizacao`,
          NCM: $`NCM`
        }
      },
      { Id: true }
    ]
  })

  const { data: unitsOfMeasureData } = useTypedQuery({
    UnidadesDeMedidas: [{}, { Valor: true, Comentario: true }]
  })

  const productSchema = yup.object().shape({
    Nome: yup.string().required('Preencha o campo para continuar'),
    // Descricao: yup.string().required('Preencha o campo para continuar'),
    Utilizacao: yup.string().required('Preencha o campo para continuar'),
    UnidadeMedida: yup.object().required('Selecione uma unidade de medida')
  })

  return (
    <CreateContext.Provider
      value={{
        createProduct,
        createProductLoading,
        productSchema,
        unitsOfMeasureData
      }}
    >
      {children}
    </CreateContext.Provider>
  )
}

export const useCreate = () => {
  return useContext(CreateContext)
}
