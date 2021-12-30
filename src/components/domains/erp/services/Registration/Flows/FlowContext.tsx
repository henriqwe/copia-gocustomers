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

type FlowContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  flowsData?: {
    Id: string
    Nome: string
  }[]

  flowsRefetch: () => void
  flowsLoading: boolean
  createFlow: (
    options?: MutationFunctionOptions<
      {
        insert_atendimentos_Fluxos_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createFlowLoading: boolean
  softDeleteFlowLoading: boolean
  softDeleteFlow: (
    options?: MutationFunctionOptions<
      {
        update_atendimentos_Fluxos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateFlowLoading: boolean
  updateFlow: (
    options?: MutationFunctionOptions<
      {
        update_atendimentos_Fluxos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>

  flowSchema: yup.ObjectSchema<
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
  data?: GraphQLTypes['atendimentos_Fluxos'] | null
  open: boolean
}

export const FlowContext = createContext<FlowContextProps>(
  {} as FlowContextProps
)

export const FlowProvider = ({ children }: ProviderProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    type: 'create',
    open: false
  })

  const [createFlow, { loading: createFlowLoading }] = useTypedMutation({
    insert_atendimentos_Fluxos_one: [
      {
        object: {
          Nome: $`Nome`
        }
      },
      { Id: true }
    ]
  })

  const [updateFlow, { loading: updateFlowLoading }] = useTypedMutation({
    update_atendimentos_Fluxos_by_pk: [
      {
        pk_columns: { Id: $`Id` },
        _set: {
          Nome: $`Nome`,
          updated_at: new Date()
        }
      },
      { Id: true }
    ]
  })

  const [softDeleteFlow, { loading: softDeleteFlowLoading }] = useTypedMutation(
    {
      update_atendimentos_Fluxos_by_pk: [
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
    }
  )

  const {
    data: flowsData,
    refetch: flowsRefetch,
    loading: flowsLoading
  } = useTypedQuery(
    {
      atendimentos_Fluxos: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          Nome: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const flowSchema = yup.object().shape({
    Nome: yup.string().required('Preencha o campo para continuar')
  })

  return (
    <FlowContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        flowsData: flowsData?.atendimentos_Fluxos,
        flowsRefetch,
        flowsLoading,
        createFlow,
        createFlowLoading,
        softDeleteFlowLoading,
        softDeleteFlow,
        updateFlowLoading,
        updateFlow,
        flowSchema
      }}
    >
      {children}
    </FlowContext.Provider>
  )
}

export const useFlow = () => {
  return useContext(FlowContext)
}
