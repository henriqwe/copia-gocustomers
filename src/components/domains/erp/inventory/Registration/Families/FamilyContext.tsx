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

type FamiliesContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  familiesData?: {
    estoque_Familias: {
      Id: string
      Nome: string
      Descricao: string
      Pai?: {
        Id: string
        Nome: string
      }
      Filhos: {
        Id: string
        Nome: string
        Filhos: {
          Id: string
          Nome: string
        }[]
      }[]
    }[]
  }
  familiesRefetch: () => void
  familiesLoading: boolean
  parentsFamiliesData?: {
    Id: string
    Nome: string
    Descricao: string
    Pai?: {
      Id: string
      Nome: string
    }
    Filhos: {
      Id: string
      Nome: string
      Filhos: {
        Id: string
        Nome: string
      }[]
    }[]
  }[]
  parentsFamiliesRefetch: () => void
  parentsFamiliesLoading: boolean

  createFamily: (
    options?: MutationFunctionOptions<
      {
        insert_estoque_Familias_one?: {
          Id: string
          Nome: string
          Descricao: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createFamilyLoading: boolean
  softDeleteFamilyLoading: boolean
  softDeleteFamily: (
    options?: MutationFunctionOptions<
      {
        update_estoque_Familias_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateFamilyLoading: boolean
  updateFamily: (
    options?: MutationFunctionOptions<
      {
        update_estoque_Familias_by_pk?: {
          Id: string
          Nome: string
          Descricao: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>

  familySchema: any
  SearchParentLessFamilies: () => Promise<{
    estoque_Familias: {
      Id: string
      Nome: string
    }[]
  }>
}

type ProvedorProps = {
  children: ReactNode
}

type SlidePanelStateType = {
  type: 'create' | 'update'
  data?: GraphQLTypes['estoque_Familias'] | null
  open: boolean
}

export const FamilyContext = createContext<FamiliesContextProps>(
  {} as FamiliesContextProps
)

export const FamilyProvider = ({ children }: ProvedorProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    type: 'create',
    open: false
  })

  const [createFamily, { loading: createFamilyLoading }] = useTypedMutation({
    insert_estoque_Familias_one: [
      {
        object: {
          Nome: $`Nome`,
          Descricao: $`Descricao`,
          Pai_Id: $`Pai_Id`
        }
      },
      { Id: true, Nome: true, Descricao: true }
    ]
  })

  const [updateFamily, { loading: updateFamilyLoading }] = useTypedMutation({
    update_estoque_Familias_by_pk: [
      {
        pk_columns: { Id: $`Id` },
        _set: {
          Nome: $`Nome`,
          Descricao: $`Descricao`,
          Pai_Id: $`Pai_Id`
        }
      },
      { Id: true, Nome: true, Descricao: true }
    ]
  })

  const [softDeleteFamily, { loading: softDeleteFamilyLoading }] =
    useTypedMutation({
      update_estoque_Familias_by_pk: [
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
    data: parentsFamiliesData,
    refetch: parentsFamiliesRefetch,
    loading: parentsFamiliesLoading
  } = useTypedQuery(
    {
      estoque_Familias: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true }, Pai_Id: { _is_null: true } }
        },
        {
          Id: true,
          Nome: true,
          Descricao: true,
          Pai: {
            Id: true,
            Nome: true
          },
          Filhos: [
            {
              where: {
                deleted_at: { _is_null: true }
              }
            },
            {
              Id: true,
              Nome: true,
              Filhos: [
                {
                  where: {
                    deleted_at: { _is_null: true }
                  }
                },
                {
                  Id: true,
                  Nome: true
                }
              ]
            }
          ]
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const {
    data: familiesData,
    refetch: familiesRefetch,
    loading: familiesLoading
  } = useTypedQuery(
    {
      estoque_Familias: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          Nome: true,
          Descricao: true,
          Pai: {
            Id: true,
            Nome: true
          },
          Filhos: [
            {},
            {
              Id: true,
              Nome: true,
              Filhos: [
                {},
                {
                  Id: true,
                  Nome: true
                }
              ]
            }
          ]
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  async function SearchParentLessFamilies() {
    const { data } = await useTypedClientQuery({
      estoque_Familias: [
        {
          where: {
            deleted_at: { _is_null: true },
            Pai_Id: { _is_null: true }
          }
        },
        {
          Id: true,
          Nome: true
        }
      ]
    })
    return data
  }

  const familySchema = yup.object().shape({
    Nome: yup.string().required('Preencha o campo para continuar'),
    Descricao: yup.string().required('Preencha o campo para continuar'),
    Pai: yup.object()
  })

  return (
    <FamilyContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        familiesData,
        familiesRefetch,
        familiesLoading,
        parentsFamiliesData: parentsFamiliesData?.estoque_Familias,
        parentsFamiliesRefetch,
        parentsFamiliesLoading,
        createFamily,
        createFamilyLoading,
        softDeleteFamilyLoading,
        softDeleteFamily,
        updateFamilyLoading,
        updateFamily,
        familySchema,
        SearchParentLessFamilies
      }}
    >
      {children}
    </FamilyContext.Provider>
  )
}

export const useFamily = () => {
  return useContext(FamilyContext)
}
