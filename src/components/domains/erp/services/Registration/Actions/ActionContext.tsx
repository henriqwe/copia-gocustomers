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

type ActionContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  actionsData?: {
    Id: string
    Url: string
    Titulo: string
    Etapas_Id: string[]
  }[]

  actionsRefetch: () => void
  actionsLoading: boolean
  createAction: (
    options?: MutationFunctionOptions<
      {
        insert_comercial_Acoes_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createActionLoading: boolean
  softDeleteActionLoading: boolean
  softDeleteAction: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Acoes_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateActionLoading: boolean
  updateAction: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Acoes_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>

  actionSchema: any
}

type ProviderProps = {
  children: ReactNode
}

type SlidePanelStateType = {
  type: 'create' | 'update'
  data?: GraphQLTypes['comercial_Acoes'] | null
  open: boolean
}

export const ActionContext = createContext<ActionContextProps>(
  {} as ActionContextProps
)

export const ActionProvider = ({ children }: ProviderProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    type: 'create',
    open: false
  })

  const [createAction, { loading: createActionLoading }] = useTypedMutation({
    insert_comercial_Acoes_one: [
      {
        object: {
          Titulo: $`Titulo`,
          Url: $`Url`,
          Etapas_Id: $`Etapas_Id`
        }
      },
      { Id: true }
    ]
  })

  const [updateAction, { loading: updateActionLoading }] = useTypedMutation({
    update_comercial_Acoes_by_pk: [
      {
        pk_columns: { Id: $`Id` },
        _set: {
          Titulo: $`Titulo`,
          Url: $`Url`,
          Etapas_Id: $`Etapas_Id`,
          updated_at: new Date()
        }
      },
      { Id: true }
    ]
  })

  const [softDeleteAction, { loading: softDeleteActionLoading }] =
    useTypedMutation({
      update_comercial_Acoes_by_pk: [
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
    data: actionsData,
    refetch: actionsRefetch,
    loading: actionsLoading
  } = useTypedQuery(
    {
      comercial_Acoes: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          Url: true,
          Titulo: true,
          Etapas_Id: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const actionSchema = yup.object().shape({
    Titulo: yup.string().required('Preencha o campo para continuar'),
    Url: yup.object().required('Preencha o campo para continuar'),
    Etapas_Id: yup
      .array()
      .min(1, 'Selecione pelo menos uma etapa para continuar')
      .required('Selecione pelo menos uma etapa para continuar')
  })

  return (
    <ActionContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        actionsData: actionsData?.comercial_Acoes,
        actionsRefetch,
        actionsLoading,
        createAction,
        createActionLoading,
        softDeleteActionLoading,
        softDeleteAction,
        updateActionLoading,
        updateAction,
        actionSchema
      }}
    >
      {children}
    </ActionContext.Provider>
  )
}

export const useAction = () => {
  return useContext(ActionContext)
}
