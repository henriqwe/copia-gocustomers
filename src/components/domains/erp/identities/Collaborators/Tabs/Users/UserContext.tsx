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

type UserContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  collaboratorsData?: {
    Id: string
    Pessoa: {
      Nome: string
    }
  }[]
  usersData?: {
    Id: string
    Cliente?: {
      Id: string
      Pessoa: {
        Nome: string
      }
    }
    Colaborador?: {
      Id: string
      Pessoa: {
        Nome: string
      }
    }
  }[]
  collaboratorsRefetch: () => void
  usersLoading: boolean
  usersRefetch: () => void
  createUser: (
    options?: MutationFunctionOptions<
      {
        insert_autenticacao_Usuarios_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createUserLoading: boolean
  softDeleteUserLoading: boolean
  softDeleteUser: (
    options?: MutationFunctionOptions<
      {
        update_autenticacao_Usuarios_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateUserLoading: boolean
  updateUser: (
    options?: MutationFunctionOptions<
      {
        update_autenticacao_Usuarios_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>

  userSchema: any
}

type ProviderProps = {
  children: ReactNode
}

type SlidePanelStateType = {
  type: 'create' | 'update'
  data?: GraphQLTypes['autenticacao_Usuarios'] | null
  open: boolean
}

export const UserContext = createContext<UserContextProps>(
  {} as UserContextProps
)

export const UserProvider = ({ children }: ProviderProps) => {
  const router = useRouter()
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    type: 'create',
    open: false
  })

  const [createUser, { loading: createUserLoading }] = useTypedMutation({
    insert_autenticacao_Usuarios_one: [
      {
        object: {
          Colaborador_Id: router.query.id,
          Email: $`Email`,
          Senha: $`Senha`
        }
      },
      { Id: true }
    ]
  })

  const [updateUser, { loading: updateUserLoading }] = useTypedMutation({
    update_autenticacao_Usuarios_by_pk: [
      {
        pk_columns: { Id: $`Id` },
        _set: {
          Email: $`Email`,
          Senha: $`Senha`,
          updated_at: new Date()
        }
      },
      { Id: true }
    ]
  })

  const [softDeleteUser, { loading: softDeleteUserLoading }] = useTypedMutation(
    {
      update_autenticacao_Usuarios_by_pk: [
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
    }
  )

  const {
    data: usersData,
    refetch: usersRefetch,
    loading: usersLoading
  } = useTypedQuery(
    {
      autenticacao_Usuarios: [
        {
          order_by: [{ created_at: 'desc' }],
          where: {
            deleted_at: { _is_null: true },
            Colaborador_Id: { _eq: router.query.id }
          }
        },
        {
          Id: true,
          Colaborador: {
            Id: true,
            Pessoa: {
              Nome: true
            }
          },
          Email: true,
          Senha: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const { data: collaboratorsData, refetch: collaboratorsRefetch } =
    useTypedQuery(
      {
        identidades_Colaboradores: [
          {
            order_by: [{ created_at: 'desc' }],
            where: { deleted_at: { _is_null: true } }
          },
          {
            Id: true,
            Pessoa: {
              Nome: true
            }
          }
        ]
      },
      { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
    )

  const userSchema = yup.object().shape({
    Email: yup.string().required('Preencha o campo para continuar'),
    Senha: yup.string().required('Preencha o campo para continuar')
  })

  return (
    <UserContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        collaboratorsData: collaboratorsData?.identidades_Colaboradores,
        collaboratorsRefetch,
        usersData: usersData?.autenticacao_Usuarios,
        usersRefetch,
        usersLoading,
        createUser,
        createUserLoading,
        softDeleteUserLoading,
        softDeleteUser,
        updateUserLoading,
        updateUser,
        userSchema
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  return useContext(UserContext)
}
