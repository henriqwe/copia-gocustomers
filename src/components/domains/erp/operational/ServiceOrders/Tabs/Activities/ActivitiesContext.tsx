import { useTypedQuery } from 'graphql/generated/zeus/apollo'
import { useRouter } from 'next/router'
import { createContext, ReactNode, useContext } from 'react'

type ActivitiesContextProps = {
  serviceOrderActivitiesData?: {
    Id: string
    Situacao: {
      Comentario: string
    }
    MotivoRecusado?: string
    created_at: Date
  }[]

  serviceOrderActivitiesRefetch: () => void
  serviceOrderActivitiesLoading: boolean
}

type ProviderProps = {
  children: ReactNode
}

export const ActivitiesContext = createContext<ActivitiesContextProps>(
  {} as ActivitiesContextProps
)

export const ActivitiesProvider = ({ children }: ProviderProps) => {
  const router = useRouter()
  const {
    data: serviceOrderActivitiesData,
    refetch: serviceOrderActivitiesRefetch,
    loading: serviceOrderActivitiesLoading
  } = useTypedQuery(
    {
      operacional_OrdemDeServico_Atividades: [
        {
          order_by: [{ created_at: 'desc' }],
          where: {
            deleted_at: { _is_null: true },
            OrdemDeServico_Id: { _eq: router.query.id }
          }
        },
        {
          Id: true,
          Situacao: {
            Comentario: true
          },
          MotivoRecusado: true,
          created_at: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  return (
    <ActivitiesContext.Provider
      value={{
        serviceOrderActivitiesData:
          serviceOrderActivitiesData?.operacional_OrdemDeServico_Atividades,
        serviceOrderActivitiesRefetch,
        serviceOrderActivitiesLoading
      }}
    >
      {children}
    </ActivitiesContext.Provider>
  )
}

export const useActivities = () => {
  return useContext(ActivitiesContext)
}
