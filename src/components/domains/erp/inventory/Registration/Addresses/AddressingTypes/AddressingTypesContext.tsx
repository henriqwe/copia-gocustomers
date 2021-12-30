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

type DataReturn = Pick<
  GraphQLTypes['estoque_TiposDeEnderecamentos'],
  'Nome' | 'Descricao' | 'Id' | 'Slug' | 'CodigoReferencia'
>

type AddressingTypesContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  addressingTypesData?: DataReturn[]

  addressingTypesRefetch: () => void
  addressingTypesLoading: boolean
  createAddressingType: (
    options?: MutationFunctionOptions<
      {
        insert_estoque_TiposDeEnderecamentos_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createAddressingTypeLoading: boolean
  softDeleteAddressingTypeLoading: boolean
  softDeleteAddressingType: (
    options?: MutationFunctionOptions<
      {
        update_estoque_TiposDeEnderecamentos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateAddressingTypeLoading: boolean
  updateAddressingType: (
    options?: MutationFunctionOptions<
      {
        update_estoque_TiposDeEnderecamentos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>

  addressingTypesSchema: any
}

type ProviderProps = {
  children: ReactNode
}

type SlidePanelStateType = {
  type: 'create' | 'update'
  data?: GraphQLTypes['estoque_TiposDeEnderecamentos'] | null
  open: boolean
}

export const AddressingTypeContext = createContext<AddressingTypesContextProps>(
  {} as AddressingTypesContextProps
)

export const AddressingTypeProvider = ({ children }: ProviderProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    type: 'create',
    open: false
  })

  const [createAddressingType, { loading: createAddressingTypeLoading }] =
    useTypedMutation({
      insert_estoque_TiposDeEnderecamentos_one: [
        {
          object: {
            Nome: $`Nome`,
            Descricao: $`Descricao`,
            Tipo: $`Tipo`,
            Slug: $`Slug`,
            Pai_Id: $`Pai_Id`
          }
        },
        { Id: true }
      ]
    })

  const [updateAddressingType, { loading: updateAddressingTypeLoading }] =
    useTypedMutation({
      update_estoque_TiposDeEnderecamentos_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            Nome: $`Nome`,
            Descricao: $`Descricao`,
            Tipo_Id: $`Tipo`,
            Slug: $`Slug`,
            Pai_Id: $`Pai_Id`,
            updated_at: new Date()
          }
        },
        { Id: true }
      ]
    })

  const [
    softDeleteAddressingType,
    { loading: softDeleteAddressingTypeLoading }
  ] = useTypedMutation({
    update_estoque_TiposDeEnderecamentos_by_pk: [
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
    data: addressingTypesData,
    refetch: addressingTypesRefetch,
    loading: addressingTypesLoading
  } = useTypedQuery(
    {
      estoque_TiposDeEnderecamentos: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          Nome: true,
          Slug: true,
          Descricao: true,
          CodigoReferencia: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const addressingTypesSchema = yup.object().shape({
    Nome: yup.string().required('Preencha o campo para continuar'),
    Descricao: yup.string().required('Preencha o campo para continuar')
  })

  // FIXME corrigir tipo global para mutations
  return (
    <AddressingTypeContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        addressingTypesData: addressingTypesData?.estoque_TiposDeEnderecamentos,
        addressingTypesRefetch,
        addressingTypesLoading,
        createAddressingType,
        createAddressingTypeLoading,
        softDeleteAddressingTypeLoading,
        softDeleteAddressingType,
        updateAddressingTypeLoading,
        updateAddressingType,
        addressingTypesSchema
      }}
    >
      {children}
    </AddressingTypeContext.Provider>
  )
}

export const useAddressingType = () => {
  return useContext(AddressingTypeContext)
}
