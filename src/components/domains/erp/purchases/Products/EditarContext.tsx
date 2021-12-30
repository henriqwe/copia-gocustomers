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
import { useRouter } from 'next/router'
import { createContext, ReactNode, useContext } from 'react'
import * as yup from 'yup'

type UpdateContextProps = {
  // logs?: {
  //   compras_Logs: {
  //     Operacao: string
  //     created_at: string
  //   }[]
  // }
  updateProductLoading: boolean
  updateProduct: (
    options?: MutationFunctionOptions<
      {
        update_Produtos_by_pk?: {
          Nome: string
          // Descricao: string
          Utilizacao: string
          UnidadeDeMedida_Id: string
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>

  productSchema: any
  productData?: DadosDetalhes
  productLoading: boolean
  productRefetch: () => void
  // logRefetch: () => void
  unitsOfMeasureData?: {
    UnidadesDeMedidas: {
      Valor: string
      Comentario: string
    }[]
  }
}

type DadosDetalhes = {
  Id: string
  Nome: string
  // Descricao: string
  Utilizacao: string
  UnidadeDeMedida_Id: string
  NCM: number
}

type ProviderProps = {
  children: ReactNode
}

export const UpdateContext = createContext<UpdateContextProps>(
  {} as UpdateContextProps
)

export const UpdateProvider = ({ children }: ProviderProps) => {
  const { query } = useRouter()
  //console.log(query)

  const [updateProduct, { loading: updateProductLoading }] = useTypedMutation({
    update_Produtos_by_pk: [
      {
        pk_columns: { Id: $`Id` },
        _set: {
          Nome: $`Nome`,
          updated_at: new Date(),
          // Descricao: $`Descricao`,
          UnidadeDeMedida_Id: $`UnidadeDeMedida_Id`,
          Utilizacao: $`Utilizacao`,
          Fabricante_Id: $`Fabricante_Id`,
          NCM: $`NCM`
        }
      },
      {
        Id: true,
        Nome: true,
        // Descricao: true,
        Utilizacao: true,
        UnidadeDeMedida_Id: true
      }
    ]
  })

  // const { data: logs, refetch: logRefetch } = useTypedQuery(
  //   {
  //     compras_Logs: [
  //       {
  //         order_by: [{ created_at: 'desc' }],
  //         where: {
  //           deleted_at: { _is_null: true },
  //           Tipo: { _eq: 'Produtos' },
  //           TipoId: { _eq: query.id }
  //         }
  //       },
  //       {
  //         created_at: true,
  //         Operacao: true,
  //         TipoId: true
  //       }
  //     ]
  //   },
  //   { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  // )

  const {
    data: productData,
    loading: productLoading,
    refetch: productRefetch
  } = useTypedQuery(
    {
      Produtos_by_pk: [
        {
          Id: query.id
        },
        {
          Id: true,
          Nome: true,
          // Descricao: true,
          Utilizacao: true,
          UnidadeDeMedida_Id: true,
          NCM: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

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
    <UpdateContext.Provider
      value={{
        updateProductLoading,
        updateProduct,
        productSchema,
        // logs,
        productData: productData?.Produtos_by_pk,
        productLoading,
        productRefetch,
        // logRefetch,
        unitsOfMeasureData
      }}
    >
      {children}
    </UpdateContext.Provider>
  )
}

export const useUpdate = () => {
  return useContext(UpdateContext)
}
