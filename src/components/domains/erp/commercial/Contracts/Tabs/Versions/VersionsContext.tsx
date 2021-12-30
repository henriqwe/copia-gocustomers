import {
  ApolloCache,
  ApolloError,
  DefaultContext,
  FetchResult,
  MutationFunctionOptions,
  OperationVariables
} from '@apollo/client'
import {
  $,
  useTypedMutation,
  useTypedQuery
} from 'graphql/generated/zeus/apollo'
import { createContext, ReactNode, useContext } from 'react'
import { useRouter } from 'next/router'

type ContractVersionsContextProps = {
  contractVersionsData?: {
    Id: string
    Versao: string
  }[]
  contractVersionsLoading: boolean
  contractVersionsRefetch: () => void
  createContractVersion: (
    options?: MutationFunctionOptions<
      {
        insert_comercial_ContratosBase_Versoes_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createContractVersionLoading: boolean
  createContractVersionError?: ApolloError
}

type ProvedorProps = {
  children: ReactNode
}

export const ContractVersionsContext =
  createContext<ContractVersionsContextProps>(
    {} as ContractVersionsContextProps
  )

export const ContractVersionsProvider = ({ children }: ProvedorProps) => {
  const router = useRouter()

  const {
    data: contractVersionsData,
    loading: contractVersionsLoading,
    refetch: contractVersionsRefetch
  } = useTypedQuery({
    comercial_ContratosBase_Versoes: [
      {
        order_by: [{ created_at: 'desc' }],
        where: {
          deleted_at: { _is_null: true },
          ContratoBase_Id: { _eq: router.query.id }
        }
      },
      {
        Id: true,
        Versao: true
      }
    ]
  })

  const [
    createContractVersion,
    { loading: createContractVersionLoading, error: createContractVersionError }
  ] = useTypedMutation({
    insert_comercial_ContratosBase_Versoes_one: [
      {
        object: {
          Versao: $`Versao`,
          ContratoBase_Id: router.query.id
        }
      },
      {
        Id: true
      }
    ]
  })

  return (
    <ContractVersionsContext.Provider
      value={{
        contractVersionsData:
          contractVersionsData?.comercial_ContratosBase_Versoes,
        contractVersionsLoading,
        contractVersionsRefetch,
        createContractVersion,
        createContractVersionLoading,
        createContractVersionError
      }}
    >
      {children}
    </ContractVersionsContext.Provider>
  )
}

export const useContractVersions = () => {
  return useContext(ContractVersionsContext)
}
