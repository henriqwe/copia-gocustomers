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

type TariffsContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  tariffsData?: {
    Id: string
    Nome: string
  }[]

  tariffsRefetch: () => void
  tariffsLoading: boolean
  createTariff: (
    options?: MutationFunctionOptions<
      {
        insert_comercial_Tarifas_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createTariffLoading: boolean
  softDeleteTariffLoading: boolean
  softDeleteTariff: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Tarifas_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateTariffLoading: boolean
  updateTariff: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Tarifas_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>

  tariffSchema: yup.ObjectSchema<
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
  data?: GraphQLTypes['comercial_Tarifas'] | null
  open: boolean
}

export const TariffsContext = createContext<TariffsContextProps>(
  {} as TariffsContextProps
)

export const TariffsProvider = ({ children }: ProviderProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    type: 'create',
    open: false
  })

  const [createTariff, { loading: createTariffLoading }] = useTypedMutation({
    insert_comercial_Tarifas_one: [
      {
        object: {
          Nome: $`Nome`
        }
      },
      { Id: true }
    ]
  })

  const [updateTariff, { loading: updateTariffLoading }] = useTypedMutation({
    update_comercial_Tarifas_by_pk: [
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

  const [softDeleteTariff, { loading: softDeleteTariffLoading }] =
    useTypedMutation({
      update_comercial_Tarifas_by_pk: [
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
      comercial_Tarifas: [
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

  const tariffSchema = yup.object().shape({
    Nome: yup.string().required('Preencha o campo para continuar')
  })

  return (
    <TariffsContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        tariffsData: tariffsData?.comercial_Tarifas,
        tariffsRefetch,
        tariffsLoading,
        createTariff,
        createTariffLoading,
        softDeleteTariffLoading,
        softDeleteTariff,
        updateTariffLoading,
        updateTariff,
        tariffSchema
      }}
    >
      {children}
    </TariffsContext.Provider>
  )
}

export const useTariffs = () => {
  return useContext(TariffsContext)
}
