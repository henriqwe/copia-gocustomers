import {
  ApolloCache,
  ApolloError,
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

//   type DataReturn = Pick<
//     GraphQLTypes['estoque_Grupos'],
//     'Nome' | 'Descricao' | 'Id'
//   >

type PhoneConstextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  phonesData?: {
    Id: unknown
    NomeDoResponsavel?: string
    Categorias: string[]
  }[]
  phonesLoading: boolean
  phonesRefetch: () => void
  createPhone: (
    options?: MutationFunctionOptions<
      {
        insert_contatos_Telefones_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createPhoneLoading: boolean
  createPhoneError?: ApolloError
  updatePhone: (
    options?: MutationFunctionOptions<
      {
        update_contatos_Telefones_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updatePhoneLoading: boolean
  updatePhoneError?: ApolloError
  softDeletePhone: (
    options?: MutationFunctionOptions<
      {
        update_contatos_Telefones_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  phoneSchema: any
}

type SlidePanelStateType = {
  type: 'create' | 'update'
  data?: GraphQLTypes['contatos_Telefones'] | null
  open: boolean
}

type ProvedorProps = {
  children: ReactNode
}

export const PhoneContext = createContext<PhoneConstextProps>(
  {} as PhoneConstextProps
)

export const PhoneProvider = ({ children }: ProvedorProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    type: 'create',
    open: false
  })
  const { query } = useRouter()

  const {
    data: phonesData,
    loading: phonesLoading,
    refetch: phonesRefetch
  } = useTypedQuery(
    {
      contatos_Telefones: [
        {
          order_by: [{ created_at: 'desc' }],
          where: {
            deleted_at: { _is_null: true },
            Identidades: {
              _contains: $`Ids`
            }
          }
        },
        {
          Id: true,
          Telefone: true,
          NomeDoResponsavel: true,
          Categorias: true
        }
      ]
    },
    {
      variables: {
        Ids: { cliente: query.id }
      }
    }
  )

  const [
    createPhone,
    { loading: createPhoneLoading, error: createPhoneError }
  ] = useTypedMutation({
    insert_contatos_Telefones_one: [
      {
        object: {
          Tipos: {},
          Telefone: $`Telefone`,
          Categorias: $`Categorias`,
          NomeDoResponsavel: $`NomeDoResponsavel`,
          Identidades: $`Identidades`
        }
      },
      {
        Id: true
      }
    ]
  })

  const [
    updatePhone,
    { loading: updatePhoneLoading, error: updatePhoneError }
  ] = useTypedMutation({
    update_contatos_Telefones_by_pk: [
      {
        pk_columns: { Id: $`Id` },
        _set: {
          Telefone: $`Telefone`,
          Categorias: $`Categorias`,
          NomeDoResponsavel: $`NomeDoResponsavel`
        }
      },
      { Id: true }
    ]
  })

  const [softDeletePhone] = useTypedMutation({
    update_contatos_Telefones_by_pk: [
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

  const phoneSchema = yup.object().shape({
    Telefone: yup.string().required('Preencha o campo para continuar'),
    NomeDoResponsavel: yup.string().required('Preencha o campo para continuar')
  })

  return (
    <PhoneContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        phonesData: phonesData?.contatos_Telefones,
        phonesLoading,
        phonesRefetch,
        createPhone,
        createPhoneLoading,
        createPhoneError,
        updatePhone,
        updatePhoneLoading,
        updatePhoneError,
        softDeletePhone,
        phoneSchema
      }}
    >
      {children}
    </PhoneContext.Provider>
  )
}

export const usePhone = () => {
  return useContext(PhoneContext)
}
