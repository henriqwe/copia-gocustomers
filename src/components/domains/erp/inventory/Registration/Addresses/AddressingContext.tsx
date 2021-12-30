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
import * as yup from 'yup'

type AddressingContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  adresssesData?: {
    Id: string
    Nome: string
    Descricao: string
    Tipo_Id: string
    Tipo: {
      Id: string
      Nome: string
      CodigoReferencia: number
      Slug?: string
    }
    Pai_Id?: string
    Pai?: {
      Id: string
      Nome: string
      Descricao: string
      Tipo_Id: string
      Tipo: {
        Nome: string
        Id: string
      }
    }
    Filhos: {
      Id: string
      Nome: string
      Descricao: string
      Tipo_Id: string
      Tipo: {
        Id: string
      }
    }[]
  }[]

  adresssesRefetch: () => void
  adresssesLoading: boolean
  createAddressing: (
    options?: MutationFunctionOptions<
      {
        insert_estoque_Enderecamentos_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  parentsAdressesData?: {
    Id: string
    Nome: string
    Descricao: string
    Tipo_Id: string
    Tipo: {
      Id: string
      Nome: string
      CodigoReferencia: number
      Slug?: string
    }
    Pai_Id?: string
    Pai?: {
      Id: string
      Nome: string
      Descricao: string
      Tipo_Id: string
      Tipo: {
        Nome: string
        Id: string
      }
    }
    Filhos?: {
      Id: string
      Nome: string
      Descricao: string

      Filhos?: {
        Id: string
        Nome: string
        Descricao: string
      }[]
    }[]
  }[]
  parentsAdressesRefetch: () => void
  parentsAdressesLoading: boolean
  createAddressingLoading: boolean
  softDeleteAddressingLoading: boolean
  softDeleteAddressing: (
    options?: MutationFunctionOptions<
      {
        update_estoque_Enderecamentos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateAddressingLoading: boolean
  updateAddressing: (
    options?: MutationFunctionOptions<
      {
        update_estoque_Enderecamentos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>

  addressingSchema: any
  searchAddressingByTipo: (item: string) => Promise<{
    estoque_Enderecamentos: {
      Id: string
      Nome: string
      Tipo_Id: string
    }[]
  }>
}

type ProviderProps = {
  children: ReactNode
}

type SlidePanelStateType = {
  type: 'create' | 'update'
  data?: GraphQLTypes['estoque_Enderecamentos'] | null
  open: boolean
}

export const AddressingContext = createContext<AddressingContextProps>(
  {} as AddressingContextProps
)

export const AddressingProvider = ({ children }: ProviderProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    type: 'create',
    open: false
  })

  const [createAddressing, { loading: createAddressingLoading }] =
    useTypedMutation({
      insert_estoque_Enderecamentos_one: [
        {
          object: {
            Nome: $`Nome`,
            Descricao: $`Descricao`,
            Tipo_Id: $`Tipo_Id`,
            Pai_Id: $`Pai_Id`
          }
        },
        { Id: true }
      ]
    })

  const [updateAddressing, { loading: updateAddressingLoading }] =
    useTypedMutation({
      update_estoque_Enderecamentos_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            Nome: $`Nome`,
            Descricao: $`Descricao`,
            Tipo_Id: $`Tipo_Id`,
            Pai_Id: $`Pai_Id`,
            updated_at: new Date()
          }
        },
        { Id: true }
      ]
    })

  const [softDeleteAddressing, { loading: softDeleteAddressingLoading }] =
    useTypedMutation({
      update_estoque_Enderecamentos_by_pk: [
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
    data: adresssesData,
    refetch: adresssesRefetch,
    loading: adresssesLoading
  } = useTypedQuery(
    {
      estoque_Enderecamentos: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          Nome: true,
          Descricao: true,
          Tipo_Id: true,
          Tipo: {
            Id: true,
            Nome: true,
            CodigoReferencia: true,
            Slug: true
          },
          Pai_Id: true,
          Pai: {
            Id: true,
            Nome: true,
            Descricao: true,
            Tipo_Id: true,
            Tipo: {
              Nome: true,
              Id: true
            }
          },
          Filhos: {
            Id: true,
            Nome: true,
            Descricao: true,
            Tipo_Id: true,
            Tipo: {
              Id: true
            }
          }
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const {
    data: parentsAdressesData,
    refetch: parentsAdressesRefetch,
    loading: parentsAdressesLoading
  } = useTypedQuery(
    {
      estoque_Enderecamentos: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true }, Pai_Id: { _is_null: true } }
        },
        {
          Id: true,
          Nome: true,
          Descricao: true,
          Tipo_Id: true,
          Tipo: {
            Id: true,
            Nome: true,
            CodigoReferencia: true,
            Slug: true
          },
          Pai_Id: true,
          Pai: {
            Id: true,
            Nome: true,
            Descricao: true,
            Tipo_Id: true,
            Tipo: {
              Nome: true,
              Id: true
            }
          },
          Filhos: [
            {},
            {
              Id: true,
              Nome: true,
              Descricao: true,
              Filhos: [
                {},
                {
                  Id: true,
                  Nome: true,
                  Descricao: true
                }
              ]
            }
          ]
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const addressingSchema = yup.object().shape({
    // Nome: yup.string().required('Preencha o campo para continuar'),
    Descricao: yup.string().required('Preencha o campo para continuar'),
    Tipo: yup.object().required('Preencha o campo para continuar'),
    Pai_Id: yup.object()
  })

  async function searchAddressingByTipo(tipo: string) {
    const { data } = await useTypedClientQuery({
      estoque_Enderecamentos: [
        {
          where: {
            deleted_at: { _is_null: true },
            Tipo: { Nome: { _eq: tipo } }
          }
        },
        {
          Id: true,
          Nome: true,
          Tipo_Id: true
        }
      ]
    })
    return data
  }

  return (
    <AddressingContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        adresssesData: adresssesData?.estoque_Enderecamentos,
        adresssesRefetch,
        adresssesLoading,
        parentsAdressesData: parentsAdressesData?.estoque_Enderecamentos,
        parentsAdressesRefetch,
        parentsAdressesLoading,
        createAddressing,
        createAddressingLoading,
        softDeleteAddressingLoading,
        softDeleteAddressing,
        updateAddressingLoading,
        updateAddressing,
        addressingSchema,
        searchAddressingByTipo
      }}
    >
      {children}
    </AddressingContext.Provider>
  )
}

export const useAddressing = () => {
  return useContext(AddressingContext)
}
