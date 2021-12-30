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

type AttributesContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  attributesData?: {
    Id: string
    Atributo: {
      Nome: string
    }
  }[]

  attributesRefetch: () => void
  attributesLoading: boolean
  createAttribute: (
    options?: MutationFunctionOptions<
      {
        insert_comercial_Servicos_Atributos_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createAttributeLoading: boolean
  updateAttribute: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Servicos_Atributos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateAttributeLoading: boolean
  softDeleteAttributeLoading: boolean
  softDeleteAttribute: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Servicos_Atributos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  attributeSchema: any
}

type SlidePanelStateType = {
  data?: GraphQLTypes['comercial_Servicos_Servicos'] | null
  open: boolean
}

type ProviderProps = {
  children: ReactNode
}

export const AttributesContext = createContext<AttributesContextProps>(
  {} as AttributesContextProps
)

export const AttributeProvider = ({ children }: ProviderProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    open: false
  })

  const router = useRouter()
  const [createAttribute, { loading: createAttributeLoading }] =
    useTypedMutation({
      insert_comercial_Servicos_Atributos_one: [
        {
          object: {
            Atributo_Id: $`Atributo_Id`,
            Servico_Id: router.query.id
          }
        },
        { Id: true }
      ]
    })

  const [updateAttribute, { loading: updateAttributeLoading }] =
    useTypedMutation({
      update_comercial_Servicos_Atributos_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            Atributo_Id: $`Atributo_Id`,
            updated_at: new Date()
          }
        },
        {
          Id: true
        }
      ]
    })

  const [softDeleteAttribute, { loading: softDeleteAttributeLoading }] =
    useTypedMutation({
      update_comercial_Servicos_Atributos_by_pk: [
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
    data: attributesData,
    refetch: attributesRefetch,
    loading: attributesLoading
  } = useTypedQuery(
    {
      comercial_Servicos_Atributos: [
        {
          order_by: [{ created_at: 'desc' }],
          where: {
            deleted_at: { _is_null: true },
            Produto_Id: { _eq: router.query.id }
          }
        },
        {
          Id: true,
          Atributo: {
            Nome: true
          }
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const attributeSchema = yup.object().shape({
    Atributo_Id: yup.object().required('Preencha o campo para continuar')
  })

  return (
    <AttributesContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        attributesData: attributesData?.comercial_Servicos_Atributos,
        attributesRefetch,
        attributesLoading,
        createAttribute,
        createAttributeLoading,
        updateAttribute,
        updateAttributeLoading,
        softDeleteAttributeLoading,
        softDeleteAttribute,
        attributeSchema
      }}
    >
      {children}
    </AttributesContext.Provider>
  )
}

export const useAttribute = () => {
  return useContext(AttributesContext)
}
