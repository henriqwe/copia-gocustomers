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
  listType: 'services' | 'dependents'
  setListType: Dispatch<SetStateAction<'services' | 'dependents'>>
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  dependentsServicesData?: {
    Id: string
    servicosServicos: {
      Id: string
      Servico: {
        Nome: string
      }
    }[]
  }

  dependentsServicesRefetch: () => void
  dependentsServicesLoading: boolean
  mainServicesData?: {
    Id: string
    Nome: string
  }[]

  mainServicesRefetch: () => void
  mainServicesLoading: boolean
  servicesData?: {
    Id: string
    Servico: {
      Nome: string
    }
  }[]

  servicesRefetch: () => void
  servicesLoading: boolean
  createService: (
    options?: MutationFunctionOptions<
      {
        insert_comercial_Servicos_Servicos_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createServiceLoading: boolean
  updateService: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Servicos_Servicos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateServiceLoading: boolean
  softDeleteServiceLoading: boolean
  softDeleteService: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Servicos_Servicos_by_pk?: {
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

export const ServiceContext = createContext<ServiceContextProps>(
  {} as ServiceContextProps
)

type SlidePanelStateType = {
  data?: GraphQLTypes['comercial_Servicos_Servicos'] | null
  open: boolean
}

export const ServiceProvider = ({ children }: ProviderProps) => {
  const [listType, setListType] = useState<'services' | 'dependents'>(
    'services'
  )
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    open: false
  })

  const router = useRouter()
  const [createService, { loading: createServiceLoading }] = useTypedMutation({
    insert_comercial_Servicos_Servicos_one: [
      {
        object: {
          ServicoDependente_Id: router.query.id,
          Servico_Id: $`Servico_Id`
        }
      },
      { Id: true }
    ]
  })

  const [updateService, { loading: updateServiceLoading }] = useTypedMutation({
    update_comercial_Servicos_Servicos_by_pk: [
      {
        pk_columns: { Id: $`Id` },
        _set: {
          ServicoDependente_Id: router.query.id,
          Servico_Id: $`Servico_Id`
        }
      },
      {
        Id: true
      }
    ]
  })

  const [softDeleteService, { loading: softDeleteServiceLoading }] =
    useTypedMutation({
      update_comercial_Servicos_Servicos_by_pk: [
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
      comercial_Servicos_Servicos: [
        {
          order_by: [{ created_at: 'desc' }],
          where: {
            deleted_at: { _is_null: true },
            ServicoDependente_Id: { _eq: router.query.id }
          }
        },
        {
          Id: true,
          Servico: {
            Nome: true
          }
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const {
    data: mainServicesData,
    refetch: mainServicesRefetch,
    loading: mainServicesLoading
  } = useTypedQuery(
    {
      comercial_Servicos: [
        {
          order_by: [{ created_at: 'desc' }],
          where: {
            deleted_at: { _is_null: true },
            Id: { _neq: router.query.id }
          }
        },
        {
          Id: true,
          Nome: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const {
    data: dependentsServicesData,
    refetch: dependentsServicesRefetch,
    loading: dependentsServicesLoading
  } = useTypedQuery(
    {
      comercial_Servicos_by_pk: [
        {
          Id: router.query.id
        },
        {
          Id: true,
          servicosServicos: [
            {
              where: {
                Servico_Id: { _eq: router.query.id },
                deleted_at: { _is_null: true }
              }
            },
            {
              Id: true,
              Servico: {
                Nome: true
              }
            }
          ]
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const serviceSchema = yup.object().shape({
    Servico_Id: yup.object().required('Preencha o campo para continuar')
  })

  return (
    <ServiceContext.Provider
      value={{
        listType,
        setListType,
        slidePanelState,
        setSlidePanelState,
        servicesData: servicesData?.comercial_Servicos_Servicos,
        servicesRefetch,
        servicesLoading,
        mainServicesData: mainServicesData?.comercial_Servicos,
        mainServicesRefetch,
        mainServicesLoading,
        dependentsServicesData:
          dependentsServicesData?.comercial_Servicos_by_pk,
        dependentsServicesRefetch,
        dependentsServicesLoading,
        createService,
        createServiceLoading,
        updateService,
        updateServiceLoading,
        softDeleteServiceLoading,
        softDeleteService,
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
