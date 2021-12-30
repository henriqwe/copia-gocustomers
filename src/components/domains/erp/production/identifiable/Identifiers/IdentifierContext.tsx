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

type IdentifierContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  identifiersData?: {
    Id: string
    CodigoIdentificador: number
  }[]

  identifiersRefetch: () => void
  identifiersLoading: boolean
  softDeleteIdentifierLoading: boolean
  softDeleteIdentifier: (
    options?: MutationFunctionOptions<
      {
        update_producao_Identificadores_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateIdentifierLoading: boolean
  updateIdentifier: (
    options?: MutationFunctionOptions<
      {
        update_producao_Identificadores_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  identifierSchema: any
}

type ProviderProps = {
  children: ReactNode
}

type SlidePanelStateType = {
  data?: GraphQLTypes['producao_Identificadores'] | null
  open: boolean
}

export const IdentifierContext = createContext<IdentifierContextProps>(
  {} as IdentifierContextProps
)

export const IdentifierProvider = ({ children }: ProviderProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    open: false
  })

  const [updateIdentifier, { loading: updateIdentifierLoading }] =
    useTypedMutation({
      update_producao_Identificadores_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            CodigoIdentificador: $`CodigoIdentificador`,
            updated_at: new Date()
          }
        },
        { Id: true }
      ]
    })

  const [softDeleteIdentifier, { loading: softDeleteIdentifierLoading }] =
    useTypedMutation({
      update_producao_Identificadores_by_pk: [
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
    data: identifiersData,
    refetch: identifiersRefetch,
    loading: identifiersLoading
  } = useTypedQuery(
    {
      producao_Identificadores: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          CodigoIdentificador: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const identifierSchema = yup.object().shape({
    CodigoIdentificador: yup
      .number()
      .typeError('Preencha o campo com números para continuar')
      .required('Preencha o campo com para continuar')
  })

  return (
    <IdentifierContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        identifiersData: identifiersData?.producao_Identificadores,
        identifiersRefetch,
        identifiersLoading,
        softDeleteIdentifierLoading,
        softDeleteIdentifier,
        updateIdentifierLoading,
        updateIdentifier,
        identifierSchema
      }}
    >
      {children}
    </IdentifierContext.Provider>
  )
}

export const useIdentifier = () => {
  return useContext(IdentifierContext)
}
