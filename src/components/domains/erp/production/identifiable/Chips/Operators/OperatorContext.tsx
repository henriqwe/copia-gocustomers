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

type OperatorContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  operatorsData?: {
    Id: string
    Apn: string
    Nome: string
    Senha: string
    Usuario: string
  }[]

  operatorsRefetch: () => void
  operatorsLoading: boolean
  createOperator: (
    options?: MutationFunctionOptions<
      {
        insert_Operadoras_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createOperatorLoading: boolean
  softDeleteOperatorLoading: boolean
  softDeleteOperator: (
    options?: MutationFunctionOptions<
      {
        update_Operadoras_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateOperatorLoading: boolean
  updateOperator: (
    options?: MutationFunctionOptions<
      {
        update_Operadoras_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  operatorSchema: any
}

type SlidePanelStateType = {
  type: 'create' | 'update'
  data?: GraphQLTypes['Operadoras']
  open: boolean
}

type ProviderProps = {
  children: ReactNode
}

export const OperatorContext = createContext<OperatorContextProps>(
  {} as OperatorContextProps
)

export const OperatorProvider = ({ children }: ProviderProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    type: 'create',
    open: false
  })

  const [createOperator, { loading: createOperatorLoading }] = useTypedMutation(
    {
      insert_Operadoras_one: [
        {
          object: {
            Nome: $`Nome`,
            Apn: $`Apn`,
            Senha: $`Senha`,
            Usuario: $`Usuario`
          }
        },
        { Id: true }
      ]
    }
  )

  const [updateOperator, { loading: updateOperatorLoading }] = useTypedMutation(
    {
      update_Operadoras_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            Nome: $`Nome`,
            Apn: $`Apn`,
            Senha: $`Senha`,
            Usuario: $`Usuario`,
            updated_at: new Date()
          }
        },
        { Id: true }
      ]
    }
  )

  const [softDeleteOperator, { loading: softDeleteOperatorLoading }] =
    useTypedMutation({
      update_Operadoras_by_pk: [
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
    data: operatorsData,
    refetch: operatorsRefetch,
    loading: operatorsLoading
  } = useTypedQuery(
    {
      Operadoras: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          Nome: true,
          Apn: true,
          Senha: true,
          Usuario: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const operatorSchema = yup.object().shape({
    Nome: yup.string().required('Preencha o campo para continuar'),
    Apn: yup.string().required('Preencha o campo para continuar'),
    Usuario: yup.string().required('Preencha o campo para continuar'),
    Senha: yup.string().required('Preencha o campo para continuar')
  })

  return (
    <OperatorContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        operatorsData: operatorsData?.Operadoras,
        operatorsRefetch,
        operatorsLoading,
        createOperator,
        createOperatorLoading,
        softDeleteOperatorLoading,
        softDeleteOperator,
        updateOperatorLoading,
        updateOperator,
        operatorSchema
      }}
    >
      {children}
    </OperatorContext.Provider>
  )
}

export const useOperator = () => {
  return useContext(OperatorContext)
}
