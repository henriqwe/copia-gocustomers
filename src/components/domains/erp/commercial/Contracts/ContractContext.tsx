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

type ContractContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  baseContractsData?: {
    Nome: string
    CodigoReferencia: number
    Id: string
    Parceiro: {
      Nome: string
    }
  }[]
  baseContractsRefetch: () => void
  baseContractsLoading: boolean

  createContract: (
    options?: MutationFunctionOptions<
      {
        insert_comercial_ContratosBase_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createContractLoading: boolean
  softDeleteProductLoading: boolean
  softDeleteProduct: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Produtos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  baseContractSchema: yup.ObjectSchema<
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
  data?: GraphQLTypes['comercial_Produtos'] | null
  open: boolean
}

export const ContractContext = createContext<ContractContextProps>(
  {} as ContractContextProps
)

export const ContractProvider = ({ children }: ProviderProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    open: false
  })

  const [createContract, { loading: createContractLoading }] = useTypedMutation(
    {
      insert_comercial_ContratosBase_one: [
        {
          object: {
            Nome: $`Nome`,
            Parceiro_Id: $`Parceiro_Id`
          }
        },
        { Id: true }
      ]
    }
  )

  const [softDeleteProduct, { loading: softDeleteProductLoading }] =
    useTypedMutation({
      update_comercial_Produtos_by_pk: [
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
    data: baseContractsData,
    refetch: baseContractsRefetch,
    loading: baseContractsLoading
  } = useTypedQuery(
    {
      comercial_ContratosBase: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          Nome: true,
          CodigoReferencia: true,
          Parceiro: {
            Nome: true
          }
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const baseContractSchema = yup.object().shape({
    Nome: yup.string().required('Preencha o campo para continuar'),
    Parceiro: yup
      .object()
      .required('Selecione pelo menos uma parceiro para continuar')
  })

  return (
    <ContractContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        baseContractsData: baseContractsData?.comercial_ContratosBase,
        baseContractsRefetch,
        baseContractsLoading,
        createContract,
        createContractLoading,
        softDeleteProductLoading,
        softDeleteProduct,
        baseContractSchema
      }}
    >
      {children}
    </ContractContext.Provider>
  )
}

export const useContract = () => {
  return useContext(ContractContext)
}
