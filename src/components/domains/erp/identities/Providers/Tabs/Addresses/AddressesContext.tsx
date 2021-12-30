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
import * as yup from 'yup'

//   type DataReturn = Pick<
//     GraphQLTypes['estoque_Grupos'],
//     'Nome' | 'Descricao' | 'Id'
//   >

type AddressesConstextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  addressesData?: {
    Id: string
    Bairro: string
    Cep?: string
    Cidade: {
      Id: string
      Nome: string
    }
    Complemento?: string
    Estado: {
      Id: string
      Nome: string
    }
    Logradouro: string
    Numero?: string
  }[]
  addressesLoading: boolean
  addressesRefetch: () => void
  statesData?: {
    Nome: string
    Id: string
  }[]
  createAdress: (
    options?: MutationFunctionOptions<
      {
        insert_contatos_Enderecos_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createAdressLoading: boolean
  createAdressError?: ApolloError
  updateAdress: (
    options?: MutationFunctionOptions<
      {
        update_contatos_Enderecos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateAdressLoading: boolean
  updateAdressError?: ApolloError
  softDeleteAdress: (
    options?: MutationFunctionOptions<
      {
        update_contatos_Enderecos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  getCities: (Pai_Id: string) => Promise<
    {
      Id: string
      Nome: string
    }[]
  >
  addressSchema: any
}

type ProvedorProps = {
  children: ReactNode
}

type SlidePanelStateType = {
  type: 'create' | 'update'
  data?: GraphQLTypes['contatos_Enderecos'] | null
  open: boolean
}

export const AddressContext = createContext<AddressesConstextProps>(
  {} as AddressesConstextProps
)

export const AddressProvider = ({ children }: ProvedorProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    type: 'create',
    open: false
  })
  const { query } = useRouter()

  const {
    data: addressesData,
    loading: addressesLoading,
    refetch: addressesRefetch
  } = useTypedQuery(
    {
      contatos_Enderecos: [
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
          Logradouro: true,
          Numero: true,
          Bairro: true,
          Cep: true,
          Cidade: {
            Id: true,
            Nome: true
          },
          Estado: {
            Id: true,
            Nome: true
          },
          Complemento: true
        }
      ]
    },
    {
      variables: {
        Ids: { fornecedor: query.id }
      }
    }
  )

  const { data: statesData } = useTypedQuery({
    EstadosEMunicipios: [
      {
        where: { Pai_Id: { _is_null: true } }
      },
      {
        Nome: true,
        Id: true
      }
    ]
  })

  const [
    createAdress,
    { loading: createAdressLoading, error: createAdressError }
  ] = useTypedMutation({
    insert_contatos_Enderecos_one: [
      {
        object: {
          Bairro: $`Bairro`,
          Logradouro: $`Logradouro`,
          Numero: $`Numero`,
          Categorias: [],
          Cep: $`Cep`,
          Complemento: $`Complemento`,
          Estado_Id: $`Estado_Id`,
          Cidade_Id: $`Cidade_Id`,
          Identidades: $`Identidades`
        }
      },
      {
        Id: true
      }
    ]
  })

  const [
    updateAdress,
    { loading: updateAdressLoading, error: updateAdressError }
  ] = useTypedMutation({
    update_contatos_Enderecos_by_pk: [
      {
        pk_columns: { Id: $`Id` },
        _set: {
          Bairro: $`Bairro`,
          Logradouro: $`Logradouro`,
          Numero: $`Numero`,
          Categorias: [],
          Cep: $`Cep`,
          Complemento: $`Complemento`,
          Estado_Id: $`Estado_Id`,
          Cidade_Id: $`Cidade_Id`,
          Identidades: $`Identidades`
        }
      },
      { Id: true }
    ]
  })

  const [softDeleteAdress] = useTypedMutation({
    update_contatos_Enderecos_by_pk: [
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

  const addressSchema = yup.object().shape({
    Bairro: yup.string().required('Preencha o campo para continuar'),
    Logradouro: yup.string().required('Preencha o campo para continuar'),
    Numero: yup.string(),
    Cep: yup.string().required('Preencha o campo para continuar'),
    Complemento: yup.string(),
    Estado_Id: yup.object().required('Preencha o campo para continuar'),
    Cidade_Id: yup.object().required('Preencha o campo para continuar')
  })

  async function getCities(Pai_Id: string) {
    const { data } = await useTypedClientQuery({
      EstadosEMunicipios: [
        { where: { Pai_Id: { _eq: Pai_Id } } },
        {
          Id: true,
          Nome: true
        }
      ]
    })
    return data.EstadosEMunicipios
  }

  return (
    <AddressContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        addressesData: addressesData?.contatos_Enderecos,
        addressesLoading,
        addressesRefetch,
        statesData: statesData?.EstadosEMunicipios,
        createAdress,
        createAdressLoading,
        createAdressError,
        updateAdress,
        updateAdressLoading,
        updateAdressError,
        softDeleteAdress,
        getCities,
        addressSchema
      }}
    >
      {children}
    </AddressContext.Provider>
  )
}

export const useAdress = () => {
  return useContext(AddressContext)
}
