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

type TariffsContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  tariffsData?: {
    Id: string
    Tarifa: {
      Nome: string
    }
  }[]

  tariffsRefetch: () => void
  tariffsLoading: boolean
  createTariff: (
    options?: MutationFunctionOptions<
      {
        insert_comercial_Servicos_Tarifas_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createTariffLoading: boolean
  updateTariff: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Servicos_Tarifas_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateTariffLoading: boolean
  softDeleteTariffLoading: boolean
  softDeleteTariff: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Servicos_Tarifas_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  tariffsSchema: any
}

type SlidePanelStateType = {
  data?: GraphQLTypes['comercial_Servicos_Tarifas'] | null
  open: boolean
}

type ProviderProps = {
  children: ReactNode
}

export const TariffContext = createContext<TariffsContextProps>(
  {} as TariffsContextProps
)

export const TariffProvider = ({ children }: ProviderProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    open: false
  })

  const router = useRouter()
  const [createTariff, { loading: createTariffLoading }] = useTypedMutation({
    insert_comercial_Servicos_Tarifas_one: [
      {
        object: {
          Tarifa_Id: $`Tarifa_Id`,
          Servico_Id: router.query.id
        }
      },
      { Id: true }
    ]
  })

  const [updateTariff, { loading: updateTariffLoading }] = useTypedMutation({
    update_comercial_Servicos_Tarifas_by_pk: [
      {
        pk_columns: { Id: $`Id` },
        _set: {
          Tarifa_Id: $`Tarifa_Id`,
          updated_at: new Date()
        }
      },
      {
        Id: true
      }
    ]
  })

  const [softDeleteTariff, { loading: softDeleteTariffLoading }] =
    useTypedMutation({
      update_comercial_Servicos_Tarifas_by_pk: [
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
    data: tariffsData,
    refetch: tariffsRefetch,
    loading: tariffsLoading
  } = useTypedQuery(
    {
      comercial_Servicos_Tarifas: [
        {
          order_by: [{ created_at: 'desc' }],
          where: {
            deleted_at: { _is_null: true },
            Servico_Id: { _eq: router.query.id }
          }
        },
        {
          Id: true,
          Tarifa: {
            Nome: true
          }
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const tariffsSchema = yup.object().shape({
    Tarifa_Id: yup.object().required('Preencha o campo para continuar')
  })

  return (
    <TariffContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        tariffsData: tariffsData?.comercial_Servicos_Tarifas,
        tariffsRefetch,
        tariffsLoading,
        createTariff,
        createTariffLoading,
        updateTariff,
        updateTariffLoading,
        softDeleteTariffLoading,
        softDeleteTariff,
        tariffsSchema
      }}
    >
      {children}
    </TariffContext.Provider>
  )
}

export const useTariff = () => {
  return useContext(TariffContext)
}
