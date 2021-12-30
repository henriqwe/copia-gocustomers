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

type EmailConstextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  emailsData?: {
    Id: string
    NomeDoResponsavel?: string
    Categorias: string[]
    Email: string
  }[]
  emailsLoading: boolean
  emailsRefetch: () => void
  createEmail: (
    options?: MutationFunctionOptions<
      {
        insert_contatos_Emails_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createEmailLoading: boolean
  createEmailError?: ApolloError
  updateEmail: (
    options?: MutationFunctionOptions<
      {
        update_contatos_Emails_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateEmailLoading: boolean
  updateEmailError?: ApolloError
  softDeleteEmail: (
    options?: MutationFunctionOptions<
      {
        update_contatos_Emails_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>

  emailSchema: any
}

type SlidePanelStateType = {
  type: 'create' | 'update'
  data?: GraphQLTypes['contatos_Emails'] | null
  open: boolean
}

type ProvedorProps = {
  children: ReactNode
}

export const EmailContext = createContext<EmailConstextProps>(
  {} as EmailConstextProps
)

export const EmailProvider = ({ children }: ProvedorProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    type: 'create',
    open: false
  })
  const { query } = useRouter()

  const {
    data: emailsData,
    loading: emailsLoading,
    refetch: emailsRefetch
  } = useTypedQuery(
    {
      contatos_Emails: [
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
          Email: true,
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
    createEmail,
    { loading: createEmailLoading, error: createEmailError }
  ] = useTypedMutation({
    insert_contatos_Emails_one: [
      {
        object: {
          Email: $`Email`,
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
    updateEmail,
    { loading: updateEmailLoading, error: updateEmailError }
  ] = useTypedMutation({
    update_contatos_Emails_by_pk: [
      {
        pk_columns: { Id: $`Id` },
        _set: {
          Email: $`Email`,
          Categorias: $`Categorias`,
          NomeDoResponsavel: $`NomeDoResponsavel`
        }
      },
      { Id: true }
    ]
  })

  const [softDeleteEmail] = useTypedMutation({
    update_contatos_Emails_by_pk: [
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

  const emailSchema = yup.object().shape({
    Email: yup.string().email().required('Preencha o campo para continuar'),
    NomeDoResponsavel: yup.string().required('Preencha o campo para continuar')
  })

  return (
    <EmailContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        emailsData: emailsData?.contatos_Emails,
        emailsLoading,
        emailsRefetch,
        createEmail,
        createEmailLoading,
        createEmailError,
        updateEmail,
        updateEmailLoading,
        updateEmailError,
        softDeleteEmail,
        emailSchema
      }}
    >
      {children}
    </EmailContext.Provider>
  )
}

export const useEmail = () => {
  return useContext(EmailContext)
}
