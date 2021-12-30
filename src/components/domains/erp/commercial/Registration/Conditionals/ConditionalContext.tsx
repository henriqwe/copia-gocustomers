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
import { AssertsShape, Assign, ObjectShape, TypeOfShape } from 'yup/lib/object'
import { RequiredStringSchema } from 'yup/lib/string'

type ConditionalContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  conditionalData?: {
    Id: string
    Nome: string
    Situacao: {
      Comentario: string
      Valor: string
    }
  }[]

  conditionalRefetch: () => void
  conditionalLoading: boolean
  conditionalSituationData?: {
    Valor: string
    Comentario: string
  }[]
  conditionalSituationRefetch: () => void
  conditionalSituationLoading: boolean
  createConditional: (
    options?: MutationFunctionOptions<
      {
        insert_comercial_Condicionais_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createConditionalLoading: boolean
  softDeleteConditionalLoading: boolean
  softDeleteConditional: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Condicionais_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateConditionalLoading: boolean
  updateConditional: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Condicionais_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>

  conditionalSchema: yup.ObjectSchema<
    Assign<
      ObjectShape,
      {
        Nome: RequiredStringSchema<string | undefined, Record<string, string>>
      }
    >,
    Record<string, string>,
    TypeOfShape<{
      Nome: RequiredStringSchema<string | undefined, Record<string, string>>
    }>,
    AssertsShape<{
      Nome: RequiredStringSchema<string | undefined, Record<string, string>>
    }>
  >
}

type ProviderProps = {
  children: ReactNode
}

type SlidePanelStateType = {
  type: 'create' | 'update'
  data?: GraphQLTypes['comercial_Condicionais'] | null
  open: boolean
}

export const ConditionalContext = createContext<ConditionalContextProps>(
  {} as ConditionalContextProps
)

export const ConditionalProvider = ({ children }: ProviderProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    type: 'create',
    open: false
  })

  const [createConditional, { loading: createConditionalLoading }] =
    useTypedMutation({
      insert_comercial_Condicionais_one: [
        {
          object: {
            Nome: $`Nome`,
            Situacao_Id: $`Situacao_Id`
          }
        },
        { Id: true }
      ]
    })

  const [updateConditional, { loading: updateConditionalLoading }] =
    useTypedMutation({
      update_comercial_Condicionais_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            Nome: $`Nome`,
            Situacao_Id: $`Situacao_Id`,
            updated_at: new Date()
          }
        },
        { Id: true }
      ]
    })

  const [softDeleteConditional, { loading: softDeleteConditionalLoading }] =
    useTypedMutation({
      update_comercial_Condicionais_by_pk: [
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
    data: conditionalData,
    refetch: conditionalRefetch,
    loading: conditionalLoading
  } = useTypedQuery(
    {
      comercial_Condicionais: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          Nome: true,
          Situacao: {
            Comentario: true,
            Valor: true
          }
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const {
    data: conditionalSituationData,
    refetch: conditionalSituationRefetch,
    loading: conditionalSituationLoading
  } = useTypedQuery(
    {
      comercial_CondicionaisSituacoes: [
        {},
        {
          Valor: true,
          Comentario: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const conditionalSchema = yup.object().shape({
    Nome: yup.string().required('Preencha o campo para continuar'),
    Situacao: yup.object().required('Preencha o campo para continuar')
  })

  return (
    <ConditionalContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        conditionalData: conditionalData?.comercial_Condicionais,
        conditionalRefetch,
        conditionalLoading,
        conditionalSituationData:
          conditionalSituationData?.comercial_CondicionaisSituacoes,
        conditionalSituationLoading,
        conditionalSituationRefetch,
        createConditional,
        createConditionalLoading,
        softDeleteConditionalLoading,
        softDeleteConditional,
        updateConditionalLoading,
        updateConditional,
        conditionalSchema
      }}
    >
      {children}
    </ConditionalContext.Provider>
  )
}

export const useConditional = () => {
  return useContext(ConditionalContext)
}
