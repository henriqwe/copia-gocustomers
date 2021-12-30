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
  useTypedClientQuery,
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
import { phoneUnformat } from 'utils/formaters'
import * as yup from 'yup'

type SellerContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  sellersData: Seller[]
  sellersLoading: boolean
  sellersRefetch: () => void
  createSeller: (
    options?: MutationFunctionOptions<
      {
        insert_identidades_Vendedores_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createSellerLoading: boolean
  createSellerError?: ApolloError
  updateSellerEmail: (
    options?: MutationFunctionOptions<
      {
        update_identidades_Vendedores_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateSellerEmailLoading: boolean
  updateSellerEmailError?: ApolloError
  updateSellerPhones: (
    options?: MutationFunctionOptions<
      {
        update_identidades_Vendedores_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateSellerPhonesLoading: boolean
  updateSellerPhonesError?: ApolloError
  UpdateSeller: (
    options?: MutationFunctionOptions<
      {
        update_identidades_Vendedores_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  UpdateSellerLoading: boolean
  UpdateSellerError?: ApolloError
  softDeleteSeller: (
    options?: MutationFunctionOptions<
      {
        update_identidades_Vendedores_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  getSelletById: (Id: string) => Promise<
    | {
        Emails?: string[]
        Telefones?: string[]
      }
    | undefined
  >
  sellerSchema: any
  phoneSchema: any
  emailsSchema: any
}

type Seller = {
  Emails: string[]
  Id: string
  Nome: string
  Telefones: string[]
}

type ProvedorProps = {
  children: ReactNode
}

type SlidePanelStateType = {
  type: 'create' | 'update'
  data?: GraphQLTypes['identidades_Vendedores'] | null
  open: boolean
}

export const SellerContext = createContext<SellerContextProps>(
  {} as SellerContextProps
)

export const SellerProvider = ({ children }: ProvedorProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    type: 'create',
    open: false
  })
  const { query } = useRouter()

  const {
    data: sellersData,
    loading: sellersLoading,
    refetch: sellersRefetch
  } = useTypedQuery({
    identidades_Vendedores: [
      {
        order_by: [{ created_at: 'desc' }],
        where: {
          deleted_at: { _is_null: true },
          Fornecedor_Id: { _eq: query.id }
        }
      },
      {
        Id: true,
        Nome: true,
        Emails: true,
        Telefones: true
      }
    ]
  })

  const [
    createSeller,
    { loading: createSellerLoading, error: createSellerError }
  ] = useTypedMutation({
    insert_identidades_Vendedores_one: [
      {
        object: {
          Nome: $`Nome`,
          Emails: [],
          Telefones: [],
          Fornecedor_Id: query.id
        }
      },
      {
        Id: true
      }
    ]
  })

  const [
    updateSellerEmail,
    { loading: updateSellerEmailLoading, error: updateSellerEmailError }
  ] = useTypedMutation({
    update_identidades_Vendedores_by_pk: [
      {
        pk_columns: { Id: $`Id` },
        _set: { Emails: $`Emails` }
      },
      {
        Id: true
      }
    ]
  })

  const [
    updateSellerPhones,
    { loading: updateSellerPhonesLoading, error: updateSellerPhonesError }
  ] = useTypedMutation({
    update_identidades_Vendedores_by_pk: [
      {
        pk_columns: { Id: $`Id` },
        _set: { Telefones: $`Telefones` }
      },
      {
        Id: true
      }
    ]
  })

  const [
    UpdateSeller,
    { loading: UpdateSellerLoading, error: UpdateSellerError }
  ] = useTypedMutation({
    update_identidades_Vendedores_by_pk: [
      {
        pk_columns: { Id: $`Id` },
        _set: {
          Nome: $`Nome`
        }
      },
      { Id: true }
    ]
  })

  const [softDeleteSeller] = useTypedMutation({
    update_identidades_Vendedores_by_pk: [
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

  const getSelletById = async (Id: string) => {
    const { data } = await useTypedClientQuery({
      identidades_Vendedores_by_pk: [
        { Id: Id },
        { Emails: [{}, true], Telefones: [{}, true] }
      ]
    })
    return data.identidades_Vendedores_by_pk
  }

  const sellerSchema = yup.object().shape({
    Nome: yup.string().required('Preencha o campo para continuar')
  })

  const phoneSchema = yup.object().shape({
    Telefone: yup
      .string()
      .required('Preencha o campo para continuar')
      .test(
        'equal',
        'Esse telefone já está cadastrado',
        (val: string | undefined) => {
          return !slidePanelState.data?.Telefones.includes(
            phoneUnformat(val?.toLowerCase() as string)
          )
        }
      )
      .test('equal', 'Digite um número válido', (val: string | undefined) => {
        return val?.toString().substring(13, 14) !== '_'
      })
  })

  const emailsSchema = yup.object().shape({
    Email: yup
      .string()
      .required('Preencha o campo para continuar')
      .test(
        'equal',
        'Esse e-mail já está cadastrado',
        (val: string | undefined) => {
          return !slidePanelState.data?.Emails.includes(
            val?.toLowerCase() as string
          )
        }
      )
  })

  return (
    <SellerContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        sellersData: sellersData?.identidades_Vendedores as Seller[],
        sellersLoading,
        sellersRefetch,
        createSeller,
        createSellerLoading,
        createSellerError,
        updateSellerEmail,
        updateSellerEmailLoading,
        updateSellerEmailError,
        updateSellerPhones,
        updateSellerPhonesLoading,
        updateSellerPhonesError,
        UpdateSeller,
        UpdateSellerLoading,
        UpdateSellerError,
        softDeleteSeller,
        sellerSchema,
        phoneSchema,
        emailsSchema,
        getSelletById
      }}
    >
      {children}
    </SellerContext.Provider>
  )
}

export const useSeller = () => {
  return useContext(SellerContext)
}
