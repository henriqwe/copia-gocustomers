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
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState
} from 'react'
import * as yup from 'yup'

type ModelContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  modelsData?: {
    Id: string
    Nome: string
    Descricao: string
    Fabricante: {
      Id: string
      Nome: string
    }
    Produto: {
      Id: string
      Nome: string
    }
  }[]
  modelsRefetch: () => void
  modelsLoading: boolean

  createModel: (
    options?: MutationFunctionOptions<
      {
        insert_estoque_Modelos_one?: {
          Id: string
          Nome: string
          Descricao: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createModelLoading: boolean
  softDeleteModelLoading: boolean
  softDeleteModel: (
    options?: MutationFunctionOptions<
      {
        update_estoque_Modelos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateModelLoading: boolean
  updateModel: (
    options?: MutationFunctionOptions<
      {
        update_estoque_Modelos_by_pk?: {
          Id: string
          Nome: string
          Descricao: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>

  modelSchema: any
}

type ProviderProps = {
  children: ReactNode
}

type SlidePanelStateType = {
  type: 'create' | 'update'
  data?: GraphQLTypes['estoque_Modelos'] | null
  open: boolean
}

export const ModelContext = createContext<ModelContextProps>(
  {} as ModelContextProps
)

export const ModelProvider = ({ children }: ProviderProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    type: 'create',
    open: false
  })

  const [createModel, { loading: createModelLoading }] = useTypedMutation({
    insert_estoque_Modelos_one: [
      {
        object: {
          Nome: $`Nome`,
          Descricao: $`Descricao`,
          Produto_Id: $`Produto_Id`,
          Fabricante_Id: $`Fabricante_Id`
        }
      },
      { Id: true, Nome: true, Descricao: true }
    ]
  })

  const [updateModel, { loading: updateModelLoading }] = useTypedMutation({
    update_estoque_Modelos_by_pk: [
      {
        pk_columns: { Id: $`Id` },
        _set: {
          Nome: $`Nome`,
          Descricao: $`Descricao`,
          Produto_Id: $`Produto_Id`,
          Fabricante_Id: $`Fabricante_Id`
        }
      },
      { Id: true, Nome: true, Descricao: true }
    ]
  })

  const [softDeleteModel, { loading: softDeleteModelLoading }] =
    useTypedMutation({
      update_estoque_Modelos_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            deleted_at: new Date()
          }
        },
        {
          Id: true
        }
      ]
    })

  const {
    data: modelsData,
    refetch: modelsRefetch,
    loading: modelsLoading
  } = useTypedQuery(
    {
      estoque_Modelos: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          Nome: true,
          Descricao: true,
          Fabricante: {
            Id: true,
            Nome: true
          },
          Produto: {
            Id: true,
            Nome: true
          }
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const modelSchema = yup.object().shape({
    Nome: yup.string().required('Preencha o campo para continuar'),
    Descricao: yup.string().required('Preencha o campo para continuar'),
    Produto_Id: yup.object().required('Selecione um campo para continuar'),
    Fabricante_Id: yup.object().required('Selecione um campo para continuar')
  })

  return (
    <ModelContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        modelsData: modelsData?.estoque_Modelos,
        modelsRefetch,
        modelsLoading,
        createModel,
        createModelLoading,
        softDeleteModelLoading,
        softDeleteModel,
        updateModelLoading,
        updateModel,
        modelSchema
      }}
    >
      {children}
    </ModelContext.Provider>
  )
}

export const useModel = () => {
  return useContext(ModelContext)
}
