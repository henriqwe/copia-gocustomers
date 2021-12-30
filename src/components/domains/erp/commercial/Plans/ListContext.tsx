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

type ListContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  plansData?: {
    Id: string
    Nome: string
    Servico: {
      Id: string
      Nome: string
    }
    Condicionais: {
      Id: string
      Valor: number
      Condicional: {
        Id: string
        Nome: string
      }
    }[]
    Precos: {
      Id: string
      ValorPraticado?: string
      ServicoPreco: {
        Id: string
        Valor: string
      }
      ValorBase: string
    }[]
  }[]

  plansRefetch: () => void
  plansLoading: boolean
  softDeletePlanLoading: boolean
  softDeletePlan: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Planos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
}

type SlidePanelStateType = {
  data?: GraphQLTypes['comercial_Planos'] | null
  open: boolean
}

type ProviderProps = {
  children: ReactNode
}

export const ListContext = createContext<ListContextProps>(
  {} as ListContextProps
)

export const ListProvider = ({ children }: ProviderProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    open: false
  })

  const [softDeletePlan, { loading: softDeletePlanLoading }] = useTypedMutation(
    {
      update_comercial_Planos_by_pk: [
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
    data: plansData,
    refetch: plansRefetch,
    loading: plansLoading
  } = useTypedQuery(
    {
      comercial_Planos: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          Nome: true,
          Servico: {
            Id: true,
            Nome: true
          },
          Condicionais: [
            { where: { deleted_at: { _is_null: true } } },
            { Id: true, Valor: true, Condicional: { Id: true, Nome: true } }
          ],
          Precos: [
            { order_by: [{ created_at: 'desc' }] },
            {
              Id: true,
              ServicoPreco: {
                Id: true,
                Valor: true
              },
              ValorBase: true,
              ValorPraticado: true
            }
          ]
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  return (
    <ListContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        plansData: plansData?.comercial_Planos,
        plansRefetch,
        plansLoading,
        softDeletePlanLoading,
        softDeletePlan
      }}
    >
      {children}
    </ListContext.Provider>
  )
}

export const useList = () => {
  return useContext(ListContext)
}
