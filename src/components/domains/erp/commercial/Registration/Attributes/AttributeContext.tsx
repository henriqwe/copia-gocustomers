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
import { AssertsShape, Assign, ObjectShape, TypeOfShape } from 'yup/lib/object'
import { RequiredStringSchema } from 'yup/lib/string'

type AttributesContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  attributeData?: {
    Id: string
    Nome: string
  }[]

  attributeRefetch: () => void
  attributeLoading: boolean
  createAttribute: (
    options?: MutationFunctionOptions<
      {
        insert_comercial_Atributos_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createAttributeLoading: boolean
  softDeleteAttributeLoading: boolean
  softDeleteAttribute: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Atributos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateAttributeLoading: boolean
  updateAttribute: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Atributos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>

  attributeSchema: yup.ObjectSchema<
    Assign<
      ObjectShape,
      {
        Nome: RequiredStringSchema<string | undefined, Record<string, string>>
      }
    >,
    Record<string, string>,
    TypeOfShape<{
      Nome: RequiredStringSchema<string | undefined, Record<string, string>>
    }>,
    AssertsShape<{
      Nome: RequiredStringSchema<string | undefined, Record<string, string>>
    }>
  >
}

type ProviderProps = {
  children: ReactNode
}

type SlidePanelStateType = {
  type: 'create' | 'update'
  data?: GraphQLTypes['comercial_Atributos'] | null
  open: boolean
}

export const AttributeContext = createContext<AttributesContextProps>(
  {} as AttributesContextProps
)

export const AttributeProvider = ({ children }: ProviderProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    type: 'create',
    open: false
  })

  const [createAttribute, { loading: createAttributeLoading }] =
    useTypedMutation({
      insert_comercial_Atributos_one: [
        {
          object: {
            Nome: $`Nome`
          }
        },
        { Id: true }
      ]
    })

  const [updateAttribute, { loading: updateAttributeLoading }] =
    useTypedMutation({
      update_comercial_Atributos_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            Nome: $`Nome`,
            updated_at: new Date()
          }
        },
        { Id: true }
      ]
    })

  const [softDeleteAttribute, { loading: softDeleteAttributeLoading }] =
    useTypedMutation({
      update_comercial_Atributos_by_pk: [
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
    data: attributeData,
    refetch: attributeRefetch,
    loading: attributeLoading
  } = useTypedQuery(
    {
      comercial_Atributos: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          Nome: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const attributeSchema = yup.object().shape({
    Nome: yup.string().required('Preencha o campo para continuar')
  })

  return (
    <AttributeContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        attributeData: attributeData?.comercial_Atributos,
        attributeRefetch,
        attributeLoading,
        createAttribute,
        createAttributeLoading,
        softDeleteAttributeLoading,
        softDeleteAttribute,
        updateAttributeLoading,
        updateAttribute,
        attributeSchema
      }}
    >
      {children}
    </AttributeContext.Provider>
  )
}

export const useAttribute = () => {
  return useContext(AttributeContext)
}
