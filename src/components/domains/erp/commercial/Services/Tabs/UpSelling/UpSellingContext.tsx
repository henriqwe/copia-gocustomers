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

type UpSellingContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  upSellingData?: {
    Id: string
    Nome: string
    Combo: {
      Id: string
      Nome: string
    }
    Valor: string
  }[]
  upSellingRefetch: () => void
  upSellingLoading: boolean

  createUpSelling: (
    options?: MutationFunctionOptions<
      {
        insert_comercial_Servicos_Oportunidades_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createUpSellingLoading: boolean
  updateUpSelling: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Servicos_Oportunidades_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateUpSellingLoading: boolean
  softDeleteUpSellingLoading: boolean
  softDeleteUpSelling: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Servicos_Oportunidades_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  upSellingSchema: any
}

type ProviderProps = {
  children: ReactNode
}

export const UpSellingContext = createContext<UpSellingContextProps>(
  {} as UpSellingContextProps
)

type SlidePanelStateType = {
  type: 'create' | 'update'
  data?: GraphQLTypes['comercial_Servicos_Oportunidades'] | null
  open: boolean
}

export const UpSellingProvider = ({ children }: ProviderProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    open: false,
    type: 'create'
  })

  const router = useRouter()
  const [createUpSelling, { loading: createUpSellingLoading }] =
    useTypedMutation({
      insert_comercial_Servicos_Oportunidades_one: [
        {
          object: {
            Nome: $`Nome`,
            Combo_Id: $`Combo_Id`,
            Valor: $`Valor`,
            Servico_Id: router.query.id
          }
        },
        { Id: true }
      ]
    })

  const [updateUpSelling, { loading: updateUpSellingLoading }] =
    useTypedMutation({
      update_comercial_Servicos_Oportunidades_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            Nome: $`Nome`,
            Combo_Id: $`Combo_Id`,
            Valor: $`Valor`,
            Servico_Id: router.query.id,
            updated_at: new Date()
          }
        },
        {
          Id: true
        }
      ]
    })

  const [softDeleteUpSelling, { loading: softDeleteUpSellingLoading }] =
    useTypedMutation({
      update_comercial_Servicos_Oportunidades_by_pk: [
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
    data: upSellingData,
    refetch: upSellingRefetch,
    loading: upSellingLoading
  } = useTypedQuery(
    {
      comercial_Servicos_Oportunidades: [
        {
          order_by: [{ created_at: 'desc' }],
          where: {
            deleted_at: { _is_null: true },
            Servico_Id: { _eq: router.query.id }
          }
        },
        {
          Id: true,
          Nome: true,
          Valor: true,
          Combo: {
            Id: true,
            Nome: true
          }
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const upSellingSchema = yup.object().shape({
    Nome: yup.string().required('Preencha o campo para continuar'),
    Combo_Id: yup.object().required('Preencha o campo para continuar'),
    Valor: yup.string().required('Preencha o campo para continuar')
  })

  return (
    <UpSellingContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        upSellingData: upSellingData?.comercial_Servicos_Oportunidades,
        upSellingRefetch,
        upSellingLoading,
        createUpSelling,
        createUpSellingLoading,
        updateUpSelling,
        updateUpSellingLoading,
        softDeleteUpSellingLoading,
        softDeleteUpSelling,
        upSellingSchema
      }}
    >
      {children}
    </UpSellingContext.Provider>
  )
}

export const useUpSelling = () => {
  return useContext(UpSellingContext)
}
