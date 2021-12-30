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

type LeadContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  leadsData?: {
    Id: string
    Nome: string
    Cliente?: {
      Id: string
      Pessoa: {
        Nome: string
      }
    }
    Tickets: {
      Id: string
    }[]

    Email: string
    Telefone: string
  }[]
  leadsLoading: boolean
  leadsRefetch: () => void
  createLead: (
    options?: MutationFunctionOptions<
      {
        insert_clientes_Leads_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createLeadLoading: boolean
  softDeleteLeadLoading: boolean
  softDeleteLead: (
    options?: MutationFunctionOptions<
      {
        update_clientes_Leads_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateLeadLoading: boolean
  updateLead: (
    options?: MutationFunctionOptions<
      {
        update_clientes_Leads_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>

  leadSchema: yup.ObjectSchema<
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
  data?: GraphQLTypes['clientes_Leads'] | null
  open: boolean
}

export const LeadContext = createContext<LeadContextProps>(
  {} as LeadContextProps
)

export const LeadProvider = ({ children }: ProviderProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    type: 'create',
    open: false
  })

  const [createLead, { loading: createLeadLoading }] = useTypedMutation({
    insert_clientes_Leads_one: [
      {
        object: {
          Nome: $`Nome`,
          Email: $`Email`,
          Telefone: $`Telefone`,
          Cliente_Id: $`Cliente_Id`
        }
      },
      { Id: true }
    ]
  })

  const [updateLead, { loading: updateLeadLoading }] = useTypedMutation({
    update_clientes_Leads_by_pk: [
      {
        pk_columns: { Id: $`Id` },
        _set: {
          Nome: $`Nome`,
          Email: $`Email`,
          Telefone: $`Telefone`,
          Cliente_Id: $`Cliente_Id`,
          updated_at: new Date()
        }
      },
      { Id: true }
    ]
  })

  const [softDeleteLead, { loading: softDeleteLeadLoading }] = useTypedMutation(
    {
      update_clientes_Leads_by_pk: [
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
    data: leadsData,
    refetch: leadsRefetch,
    loading: leadsLoading
  } = useTypedQuery(
    {
      clientes_Leads: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          Nome: true,
          Cliente: {
            Id: true,
            Pessoa: {
              Nome: true
            }
          },
          Tickets: [
            { where: { deleted_at: { _is_null: true } } },
            {
              Id: true
            }
          ],
          Email: true,
          Telefone: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const leadSchema = yup.object().shape({
    Nome: yup.string().required('Preencha o campo para continuar'),
    Email: yup.string().required('Preencha o campo para continuar'),
    Telefone: yup.string().required('Preencha o campo para continuar'),
    Cliente_Id: yup.object()
  })

  return (
    <LeadContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        leadsData: leadsData?.clientes_Leads,
        leadsRefetch,
        leadsLoading,
        createLead,
        createLeadLoading,
        softDeleteLeadLoading,
        softDeleteLead,
        updateLeadLoading,
        updateLead,
        leadSchema
      }}
    >
      {children}
    </LeadContext.Provider>
  )
}

export const useLead = () => {
  return useContext(LeadContext)
}
