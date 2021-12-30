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

type CoverageContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  coveragesData?: {
    Id: string
    Nome: string
  }[]

  coveragesRefetch: () => void
  coveragesLoading: boolean
  createCoverage: (
    options?: MutationFunctionOptions<
      {
        insert_comercial_Coberturas_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createCoverageLoading: boolean
  softDeleteCoverageLoading: boolean
  softDeleteCoverage: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Coberturas_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateCoverageLoading: boolean
  updateCoverage: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Coberturas_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>

  coverageSchema: yup.ObjectSchema<
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
  data?: GraphQLTypes['comercial_Coberturas'] | null
  open: boolean
}

export const CoverageContext = createContext<CoverageContextProps>(
  {} as CoverageContextProps
)

export const CoverageProvider = ({ children }: ProviderProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    type: 'create',
    open: false
  })

  const [createCoverage, { loading: createCoverageLoading }] = useTypedMutation(
    {
      insert_comercial_Coberturas_one: [
        {
          object: {
            Nome: $`Nome`
          }
        },
        { Id: true }
      ]
    }
  )

  const [updateCoverage, { loading: updateCoverageLoading }] = useTypedMutation(
    {
      update_comercial_Coberturas_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            Nome: $`Nome`,
            updated_at: new Date()
          }
        },
        { Id: true }
      ]
    }
  )

  const [softDeleteCoverage, { loading: softDeleteCoverageLoading }] =
    useTypedMutation({
      update_comercial_Coberturas_by_pk: [
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
    data: coveragesData,
    refetch: coveragesRefetch,
    loading: coveragesLoading
  } = useTypedQuery(
    {
      comercial_Coberturas: [
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

  const coverageSchema = yup.object().shape({
    Nome: yup.string().required('Preencha o campo para continuar')
  })

  return (
    <CoverageContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        coveragesData: coveragesData?.comercial_Coberturas,
        coveragesRefetch,
        coveragesLoading,
        createCoverage,
        createCoverageLoading,
        softDeleteCoverageLoading,
        softDeleteCoverage,
        updateCoverageLoading,
        updateCoverage,
        coverageSchema
      }}
    >
      {children}
    </CoverageContext.Provider>
  )
}

export const useCoverage = () => {
  return useContext(CoverageContext)
}
