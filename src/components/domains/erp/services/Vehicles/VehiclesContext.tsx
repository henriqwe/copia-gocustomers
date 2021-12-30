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
  useTypedClientQuery,
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

type VehicleContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  setVehicleCategory: Dispatch<SetStateAction<string>>
  vehicleCategory: string
  vehiclesData?: {
    Id: string
    Placa?: string
    NumeroDoChassi?: string
    Apelido?: string
    DadosDaApi?: any
    Categoria: {
      Id: string
      Nome: string
    }
    Categoria_Id: string
    Cliente?: {
      Id: string
      Pessoa: {
        Nome: string
      }
    }
  }[]
  vehiclesTypeData?: {
    Id: string
    Nome: string
  }[]
  vehiclesLoading: boolean
  vehiclesRefetch: () => void
  createVehicle: (
    options?: MutationFunctionOptions<
      {
        insert_clientes_Veiculos_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createVehicleLoading: boolean
  softDeleteTicketLoading: boolean
  softDeleteTicket: (
    options?: MutationFunctionOptions<
      {
        update_clientes_Veiculos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateVehicleLoading: boolean
  updateVehicle: (
    options?: MutationFunctionOptions<
      {
        update_clientes_Veiculos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  vehicleSchema: any
  getVehicleCategoryByName: (Name: string) => Promise<
    {
      Id: string
    }[]
  >
}

type ProviderProps = {
  children: ReactNode
}

type SlidePanelStateType = {
  type: 'create' | 'update'
  data?: GraphQLTypes['clientes_Veiculos'] | null
  open: boolean
}

export const VehicleContext = createContext<VehicleContextProps>(
  {} as VehicleContextProps
)

export const VehicleProvider = ({ children }: ProviderProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    type: 'create',
    open: false
  })
  const [vehicleCategory, setVehicleCategory] = useState('placa')

  const [createVehicle, { loading: createVehicleLoading }] = useTypedMutation({
    insert_clientes_Veiculos_one: [
      {
        object: {
          Placa: $`Placa`,
          Categoria_Id: $`Categoria_Id`,
          Cliente_Id: $`Cliente_Id`,
          DadosDaApi: $`DadosDaApi`,
          Apelido: $`Apelido`,
          NumeroDoChassi: $`NumeroDoChassi`
        }
      },
      { Id: true }
    ]
  })

  const [updateVehicle, { loading: updateVehicleLoading }] = useTypedMutation({
    update_clientes_Veiculos_by_pk: [
      {
        pk_columns: { Id: $`Id` },
        _set: {
          Placa: $`Placa`,
          Categoria_Id: $`Categoria_Id`,
          Cliente_Id: $`Cliente_Id`,
          DadosDaApi: $`DadosDaApi`,
          updated_at: new Date()
        }
      },
      { Id: true }
    ]
  })

  const [softDeleteTicket, { loading: softDeleteTicketLoading }] =
    useTypedMutation({
      update_clientes_Veiculos_by_pk: [
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
    data: vehiclesData,
    refetch: vehiclesRefetch,
    loading: vehiclesLoading
  } = useTypedQuery(
    {
      clientes_Veiculos: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          Placa: true,
          Categoria_Id: true,
          DadosDaApi: true,
          NumeroDoChassi: true,
          Apelido: true,
          Categoria: {
            Id: true,
            Nome: true
          },
          Cliente: {
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

  const { data: vehiclesTypeData } = useTypedQuery(
    {
      CategoriasDeVeiculos: [
        {},
        {
          Id: true,
          Nome: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const vehicleSchema = yup.object().shape({
    Categoria_Id: yup.object().required('Selecione a categoria para continuar'),
    Placa:
      vehicleCategory === 'placa'
        ? yup.string().required('Preencha o campo para continuar')
        : yup.string(),
    Chassi:
      vehicleCategory === 'chassi'
        ? yup.string().required('Preencha o campo para continuar')
        : yup.string(),
    Apelido: yup.string().required('Preencha o campo para continuar')
  })

  async function getVehicleCategoryByName(Name: string) {
    const { data } = await useTypedClientQuery({
      CategoriasDeVeiculos: [{ where: { Nome: { _eq: Name } } }, { Id: true }]
    })

    return data.CategoriasDeVeiculos
  }

  useEffect(() => {
    setVehicleCategory('placa')
  }, [slidePanelState.open])

  return (
    <VehicleContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        setVehicleCategory,
        vehicleCategory,
        vehiclesTypeData: vehiclesTypeData?.CategoriasDeVeiculos,
        vehiclesData: vehiclesData?.clientes_Veiculos,
        vehiclesRefetch,
        vehiclesLoading,
        createVehicle,
        createVehicleLoading,
        softDeleteTicketLoading,
        softDeleteTicket,
        updateVehicleLoading,
        updateVehicle,
        vehicleSchema,
        getVehicleCategoryByName
      }}
    >
      {children}
    </VehicleContext.Provider>
  )
}

export const useVehicle = () => {
  return useContext(VehicleContext)
}
