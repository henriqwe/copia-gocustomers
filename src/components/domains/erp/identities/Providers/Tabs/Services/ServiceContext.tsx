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

type ServiceContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  servicesData?: {
    Id: string
    Servico: {
      Id: string
      Nome: string
    }
    Valor: number
  }[]

  servicesRefetch: () => void
  servicesLoading: boolean
  commercialServicesData?: {
    Id: string
    Nome: string
    PrestadoresDeServicos: {
      Valor: number
      Id: string
      deleted_at?: Date
    }[]
  }[]
  commercialServicesRefetch: () => void
  commercialServicesLoading: boolean
  createService: (
    options?: MutationFunctionOptions<
      {
        insert_comercial_PrestadorDeServicos_Servicos_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createServiceLoading: boolean
  softDeleteServiceLoading: boolean
  softDeleteService: (
    options?: MutationFunctionOptions<
      {
        update_comercial_PrestadorDeServicos_Servicos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateServiceLoading: boolean
  updateService: (
    options?: MutationFunctionOptions<
      {
        update_comercial_PrestadorDeServicos_Servicos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>

  serviceSchema: any
}

type ProviderProps = {
  children: ReactNode
}

type SlidePanelStateType = {
  data?: GraphQLTypes['comercial_Servicos'] | null
  type: 'create' | 'disable'
  open: boolean
}

export const ServiceContext = createContext<ServiceContextProps>(
  {} as ServiceContextProps
)

export const ServiceProvider = ({ children }: ProviderProps) => {
  const router = useRouter()
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    type: 'create',
    open: false
  })

  const [createService, { loading: createServiceLoading }] = useTypedMutation({
    insert_comercial_PrestadorDeServicos_Servicos_one: [
      {
        object: {
          Servico_Id: $`Servico_Id`,
          Prestador_Id: router.query.id,
          Valor: $`Valor`,
          deleted_at: null
        }
      },
      { Id: true }
    ]
  })

  const [updateService, { loading: updateServiceLoading }] = useTypedMutation({
    update_comercial_PrestadorDeServicos_Servicos_by_pk: [
      {
        pk_columns: { Id: $`Id` },
        _set: {
          Servico_Id: $`Servico_Id`,
          Valor: $`Valor`,
          updated_at: new Date()
        }
      },
      { Id: true }
    ]
  })

  const [softDeleteService, { loading: softDeleteServiceLoading }] =
    useTypedMutation({
      update_comercial_PrestadorDeServicos_Servicos_by_pk: [
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
    data: servicesData,
    refetch: servicesRefetch,
    loading: servicesLoading
  } = useTypedQuery(
    {
      comercial_PrestadorDeServicos_Servicos: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          Valor: true,
          Servico: {
            Id: true,
            Nome: true
          }
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const {
    data: commercialServicesData,
    refetch: commercialServicesRefetch,
    loading: commercialServicesLoading
  } = useTypedQuery(
    {
      comercial_Servicos: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          Nome: true,
          PrestadoresDeServicos: [
            {
              where: {
                Prestador_Id: { _eq: router.query.id },
                deleted_at: { _is_null: true }
              }
            },
            { Valor: true, Id: true, deleted_at: true }
          ]
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const serviceSchema = yup.object().shape({
    Valor: yup.string().required('Preencha o campo para continuar')
  })

  return (
    <ServiceContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        servicesData: servicesData?.comercial_PrestadorDeServicos_Servicos,
        servicesRefetch,
        servicesLoading,
        commercialServicesData: commercialServicesData?.comercial_Servicos,
        commercialServicesRefetch,
        commercialServicesLoading,
        createService,
        createServiceLoading,
        softDeleteServiceLoading,
        softDeleteService,
        updateServiceLoading,
        updateService,
        serviceSchema
      }}
    >
      {children}
    </ServiceContext.Provider>
  )
}

export const useService = () => {
  return useContext(ServiceContext)
}
