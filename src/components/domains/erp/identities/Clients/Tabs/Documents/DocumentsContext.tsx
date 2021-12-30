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
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState
} from 'react'
import * as client from '@/domains/erp/identities/Clients'

type DocumentsContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  documentsData?: {
    Id: string
  }[]
  documentsLoading: boolean
  documentsRefetch: () => void
  createDocument: (
    options?: MutationFunctionOptions<
      {
        insert_identidades_Clientes_Documentos_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createDocumentLoading: boolean
  createDocumentError?: ApolloError
  approveDocument: (
    options?: MutationFunctionOptions<
      {
        update_identidades_Clientes_Documentos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  approveDocumentLoading: boolean
  approveDocumentError?: ApolloError
  declineDocument: (
    options?: MutationFunctionOptions<
      {
        update_identidades_Clientes_Documentos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  declineDocumentLoading: boolean
  declineDocumentError?: ApolloError
  softDeleteDocument: (
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
  getDocumentByNameAndClientId: (
    Name: string,
    PessoaId: string
  ) => Promise<
    {
      Id: string
      Situacao?: {
        Valor: string
      }
      MotivoRecusa?: string
    }[]
  >
}

type SlidePanelStateType = {
  type: 'create' | 'update'
  data?: GraphQLTypes['contatos_Telefones'] | null
  open: boolean
}

type ProvedorProps = {
  children: ReactNode
}

export const DocumentContext = createContext<DocumentsContextProps>(
  {} as DocumentsContextProps
)

export const DocumentProvider = ({ children }: ProvedorProps) => {
  const { clientData } = client.useUpdate()
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    type: 'create',
    open: false
  })

  const {
    data: documentsData,
    loading: documentsLoading,
    refetch: documentsRefetch
  } = useTypedQuery({
    identidades_Clientes_Documentos: [
      {
        order_by: [{ created_at: 'desc' }],
        where: {
          deleted_at: { _is_null: true },
          Pessoa_Id: { _eq: clientData?.Pessoa.Id }
        }
      },
      {
        Id: true,
        Pessoa: {
          Id: true,
          Nome: true
        },
        Nome: true,
        Situacao: {
          Comentario: true,
          Valor: true
        },
        MotivoRecusa: true,
        DataAprovado: true,
        DataRecusado: true
      }
    ]
  })

  const [
    createDocument,
    { loading: createDocumentLoading, error: createDocumentError }
  ] = useTypedMutation({
    insert_identidades_Clientes_Documentos_one: [
      {
        object: {
          Nome: $`Nome`,
          Pessoa_Id: $`Pessoa_Id`
        }
      },
      {
        Id: true
      }
    ]
  })

  const [
    approveDocument,
    { loading: approveDocumentLoading, error: approveDocumentError }
  ] = useTypedMutation({
    update_identidades_Clientes_Documentos_by_pk: [
      {
        pk_columns: { Id: $`Id` },
        _set: {
          DataAprovado: new Date(),
          Situacao_Id: 'aprovado',
          updated_at: new Date()
        }
      },
      { Id: true }
    ]
  })

  const [
    declineDocument,
    { loading: declineDocumentLoading, error: declineDocumentError }
  ] = useTypedMutation({
    update_identidades_Clientes_Documentos_by_pk: [
      {
        pk_columns: { Id: $`Id` },
        _set: {
          DataRecusado: new Date(),
          Situacao_Id: 'recusado',
          MotivoRecusa: $`MotivoRecusa`,
          updated_at: new Date()
        }
      },
      { Id: true }
    ]
  })

  const [softDeleteDocument] = useTypedMutation({
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

  async function getDocumentByNameAndClientId(Name: string, PessoaId: string) {
    const { data } = await useTypedClientQuery({
      identidades_Clientes_Documentos: [
        {
          where: {
            deleted_at: { _is_null: true },
            Nome: { _eq: Name },
            Pessoa_Id: { _eq: PessoaId }
          }
        },
        {
          Id: true,
          Situacao: {
            Valor: true
          },
          MotivoRecusa: true
        }
      ]
    })

    return data.identidades_Clientes_Documentos
  }

  return (
    <DocumentContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        documentsData: documentsData?.identidades_Clientes_Documentos,
        documentsLoading,
        documentsRefetch,
        createDocument,
        createDocumentLoading,
        createDocumentError,
        approveDocument,
        approveDocumentLoading,
        approveDocumentError,
        declineDocument,
        declineDocumentLoading,
        declineDocumentError,
        softDeleteDocument,
        getDocumentByNameAndClientId
      }}
    >
      {children}
    </DocumentContext.Provider>
  )
}

export const useDocument = () => {
  return useContext(DocumentContext)
}
