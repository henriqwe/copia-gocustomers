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
  useState
} from 'react'

type BusinessProfileContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  businessProfilesData?: {
    Id: string
    GrupoDePergunta: {
      Id: string
      Nome: string
    }
    Lead: {
      Id: string
      Nome: string
    }
    Pergunta: {
      Id: string
      Titulo: string
    }
    Resposta: string
  }[]

  businessProfilesRefetch: () => void
  businessProfilesLoading: boolean
  softDeleteBusinessProfileLoading: boolean
  softDeleteBusinessProfile: (
    options?: MutationFunctionOptions<
      {
        update_clientes_PerfisComerciais?: {
          returning: {
            Id: string
          }[]
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateBusinessProfileLoading: boolean
  updateBusinessProfile: (
    options?: MutationFunctionOptions<
      {
        update_clientes_PerfisComerciais_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  getQuestionAndAnswers: (
    Lead_Id: string,
    Grupo_Id: string
  ) => Promise<
    {
      Id: string
      Pergunta: {
        Id: string
        Titulo: string
        Descricao: string
      }
      Resposta: string
    }[]
  >
}

type SlidePanelStateType = {
  data?: GraphQLTypes['clientes_PerfisComerciais'] | null
  open: boolean
}

type ProviderProps = {
  children: ReactNode
}

export const BusinessProfileContext =
  createContext<BusinessProfileContextProps>({} as BusinessProfileContextProps)

export const BusinessProfileProvider = ({ children }: ProviderProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    open: false
  })

  const [
    softDeleteBusinessProfile,
    { loading: softDeleteBusinessProfileLoading }
  ] = useTypedMutation({
    update_clientes_PerfisComerciais: [
      {
        where: {
          Lead_Id: { _eq: $`Lead_Id` },
          Grupo_Id: { _eq: $`Grupo_Id` }
        },
        _set: {
          deleted_at: new Date()
        }
      },
      {
        returning: {
          Id: true
        }
      }
    ]
  })

  const [updateBusinessProfile, { loading: updateBusinessProfileLoading }] =
    useTypedMutation({
      update_clientes_PerfisComerciais_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            Resposta: $`Resposta`,
            updated_at: new Date()
          }
        },
        { Id: true }
      ]
    })

  const {
    data: businessProfilesData,
    refetch: businessProfilesRefetch,
    loading: businessProfilesLoading
  } = useTypedQuery(
    {
      clientes_PerfisComerciais: [
        {
          distinct_on: ['Grupo_Id'],
          // order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          GrupoDePergunta: {
            Id: true,
            Nome: true
          },
          Lead: {
            Id: true,
            Nome: true
          },
          Pergunta: {
            Id: true,
            Titulo: true
          },
          Resposta: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  async function getQuestionAndAnswers(Lead_Id: string, Grupo_Id: string) {
    const { data: questionsData } = await useTypedClientQuery({
      clientes_PerfisComerciais: [
        {
          where: {
            deleted_at: { _is_null: true },
            Lead_Id: { _eq: Lead_Id },
            Grupo_Id: { _eq: Grupo_Id }
          }
        },
        {
          Id: true,
          Pergunta: {
            Id: true,
            Titulo: true,
            Descricao: true
          },
          Resposta: true
        }
      ]
    })

    return questionsData.clientes_PerfisComerciais
  }

  return (
    <BusinessProfileContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        businessProfilesData: businessProfilesData?.clientes_PerfisComerciais,
        businessProfilesRefetch,
        businessProfilesLoading,
        softDeleteBusinessProfileLoading,
        softDeleteBusinessProfile,
        updateBusinessProfile,
        updateBusinessProfileLoading,
        getQuestionAndAnswers
      }}
    >
      {children}
    </BusinessProfileContext.Provider>
  )
}

export const useBusinessProfile = () => {
  return useContext(BusinessProfileContext)
}
