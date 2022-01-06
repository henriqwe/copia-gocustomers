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
  useEffect,
  useState
} from 'react'
import * as yup from 'yup'
import { getAllUserVehicles, getVehicleLocationRealTime } from '../api'

type vehicle = {
  crs: string
  data: string
  dist: string
  latitude: string
  ligado: number
  longitude: string
  speed: string
  carro_id?: number
  placa?: string
  chassis?: string
  renavan?: string
  ano_modelo?: string
  cor?: string
  veiculo?: string
  carro_fabricante?: string
  carro_categoria?: string
  carro_tipo?: string
  combustivel?: string
  ano?: string
  frota?: string
  imei?: string
  date_rastreador?: string
}
type LocalizationContextProps = {
  vehicleLocationInfo?: vehicle
  allUserVehicle?: vehicle[]
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  collaboratorsData?: {
    Id: string
    Pessoa: {
      Nome: string
    }
  }[]
  localizationsData?: {
    Id: string
    Cliente?: {
      Id: string
      Pessoa: {
        Nome: string
      }
    }
    Colaborador?: {
      Id: string
      Pessoa: {
        Nome: string
      }
    }
  }[]
  collaboratorsRefetch: () => void
  localizationsLoading: boolean
  localizationsRefetch: () => void
  createLocalization: (
    options?: MutationFunctionOptions<
      {
        insert_autenticacao_Usuarios_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createLocalizationLoading: boolean
  softDeleteLocalizationLoading: boolean
  softDeleteLocalization: (
    options?: MutationFunctionOptions<
      {
        update_autenticacao_Usuarios_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateLocalizationLoading: boolean
  updateLocalization: (
    options?: MutationFunctionOptions<
      {
        update_autenticacao_Usuarios_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>

  localizationSchema: any
}

type ProviderProps = {
  children: ReactNode
}

type SlidePanelStateType = {
  type: 'create' | 'update'
  data?: GraphQLTypes['autenticacao_Usuarios'] | null
  open: boolean
}

export const LocalizationContext = createContext<LocalizationContextProps>(
  {} as LocalizationContextProps
)

export const LocalizationProvider = ({ children }: ProviderProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    type: 'create',
    open: false
  })
  const [vehicleLocationInfo, setVehicleLocationInfo] = useState()
  const [allUserVehicle, setAllUserVehicle] = useState()

  const [createLocalization, { loading: createLocalizationLoading }] =
    useTypedMutation({
      insert_autenticacao_Usuarios_one: [
        {
          object: {
            Cliente_Id: $`Cliente_Id`,
            Colaborador_Id: $`Colaborador_Id`
          }
        },
        { Id: true }
      ]
    })

  const [updateLocalization, { loading: updateLocalizationLoading }] =
    useTypedMutation({
      update_autenticacao_Usuarios_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            Cliente_Id: $`Cliente_Id`,
            Colaborador_Id: $`Colaborador_Id`,
            updated_at: new Date()
          }
        },
        { Id: true }
      ]
    })

  const [softDeleteLocalization, { loading: softDeleteLocalizationLoading }] =
    useTypedMutation({
      update_autenticacao_Usuarios_by_pk: [
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
    data: localizationsData,
    refetch: localizationsRefetch,
    loading: localizationsLoading
  } = useTypedQuery(
    {
      autenticacao_Usuarios: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          Cliente: {
            Id: true,
            Pessoa: {
              Nome: true
            }
          },
          Colaborador: {
            Id: true,
            Pessoa: {
              Nome: true
            }
          }
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const { data: collaboratorsData, refetch: collaboratorsRefetch } =
    useTypedQuery(
      {
        identidades_Colaboradores: [
          {
            order_by: [{ created_at: 'desc' }],
            where: { deleted_at: { _is_null: true } }
          },
          {
            Id: true,
            Pessoa: {
              Nome: true
            }
          }
        ]
      },
      { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
    )

  const localizationSchema = yup.object().shape({
    Colaborador_Id: yup.object(),
    Cliente_Id: yup.object()
  })

  async function updateAllUserVehiclesLocations() {
    // setInterval(async () => {
    const responseGetUserVehicles = await getAllUserVehicles(
      'operacional@radarescolta.com'
    )
    setAllUserVehicle(responseGetUserVehicles)
    // }, 30000)
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const responseGetVehicleLocationRealTime = await getVehicleLocationRealTime(
      '285513'
    )
    setVehicleLocationInfo(responseGetVehicleLocationRealTime)
    updateAllUserVehiclesLocations()
  }, [])
  return (
    <LocalizationContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        collaboratorsData: collaboratorsData?.identidades_Colaboradores,
        collaboratorsRefetch,
        localizationsData: localizationsData?.autenticacao_Usuarios,
        localizationsRefetch,
        localizationsLoading,
        createLocalization,
        createLocalizationLoading,
        softDeleteLocalizationLoading,
        softDeleteLocalization,
        updateLocalizationLoading,
        updateLocalization,
        localizationSchema,
        vehicleLocationInfo,
        setVehicleLocationInfo,
        allUserVehicle,
        setAllUserVehicle
      }}
    >
      {children}
    </LocalizationContext.Provider>
  )
}

export const useLocalization = () => {
  return useContext(LocalizationContext)
}
