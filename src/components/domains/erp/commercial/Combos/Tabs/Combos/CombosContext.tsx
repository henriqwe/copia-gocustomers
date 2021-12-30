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

type DependenceCombosProviderProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  dependenciesCombosData?: {
    Id: string
    Valor: string
    Combo: {
      Id: string
      Nome: string
    }
  }[]

  dependenciesCombosRefetch: () => void
  dependenciesCombosLoading: boolean
  combosData?: {
    Id: string
    Nome: string
    Precos: { ValorBase: string }[]
    Combos: any[]
  }[]
  combosRefetch: () => void
  combosLoading: boolean
  softDeleteDependenceComboLoading: boolean
  softDeleteDependenceCombo: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Combos_Combos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createDependenceCombo: (
    options?: MutationFunctionOptions<
      {
        insert_comercial_Combos_Combos_one?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createDependenceComboLoading: boolean
  updateDependenceCombo: (
    options?: MutationFunctionOptions<
      {
        update_comercial_Combos_Combos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateDependenceComboLoading: boolean
  dependenceComboSchema: any
}

type ProviderProps = {
  children: ReactNode
}

export const DependenceComboContext =
  createContext<DependenceCombosProviderProps>(
    {} as DependenceCombosProviderProps
  )

type SlidePanelStateType = {
  data?: GraphQLTypes['comercial_Combos_Combos'] | null
  type: 'create' | 'update'
  open: boolean
}

export const DependenceComboProvider = ({ children }: ProviderProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    open: false,
    type: 'create'
  })
  const router = useRouter()

  const [updateDependenceCombo, { loading: updateDependenceComboLoading }] =
    useTypedMutation({
      update_comercial_Combos_Combos_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: { Valor: $`Valor`, Combo_Id: $`Combo_Id` }
        },
        {
          Id: true
        }
      ]
    })

  const [
    softDeleteDependenceCombo,
    { loading: softDeleteDependenceComboLoading }
  ] = useTypedMutation({
    update_comercial_Combos_Combos_by_pk: [
      {
        pk_columns: { Id: $`Id` },
        _set: { deleted_at: new Date() }
      },
      {
        Id: true
      }
    ]
  })

  const [createDependenceCombo, { loading: createDependenceComboLoading }] =
    useTypedMutation({
      insert_comercial_Combos_Combos_one: [
        {
          object: {
            Combo_Id: $`Combo_Id`,
            ComboPertencente_Id: router.query.id,
            Valor: $`Valor`
          }
        },
        { Id: true }
      ],
      update_comercial_Combos_by_pk: [
        {
          pk_columns: { Id: router.query.id },
          _set: { updated_at: new Date() }
        },
        { Id: true }
      ]
    })

  const {
    data: dependenciesCombosData,
    refetch: dependenciesCombosRefetch,
    loading: dependenciesCombosLoading
  } = useTypedQuery(
    {
      comercial_Combos_Combos: [
        {
          order_by: [{ created_at: 'desc' }],
          where: {
            deleted_at: { _is_null: true },
            ComboPertencente_Id: { _eq: router.query.id }
          }
        },
        {
          Id: true,
          Valor: true,
          Combo: {
            Id: true,
            Nome: true
          }
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const {
    data: combosData,
    refetch: combosRefetch,
    loading: combosLoading
  } = useTypedQuery(
    {
      comercial_Combos: [
        {
          where: {
            deleted_at: { _is_null: true },
            Id: { _neq: router.query.id }
          }
        },
        {
          Id: true,
          Nome: true,
          Combos: [{}, { Id: true }],
          Precos: [{ order_by: [{ created_at: 'desc' }] }, { ValorBase: true }]
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const dependenceComboSchema = yup.object().shape({
    Valor: yup.string().required('Preencha o campo para continuar'),
    Combo: yup.object().required('Selecione o combo para continuar')
  })

  return (
    <DependenceComboContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        dependenciesCombosData: dependenciesCombosData?.comercial_Combos_Combos,
        dependenciesCombosLoading,
        dependenciesCombosRefetch,
        createDependenceCombo,
        createDependenceComboLoading,
        softDeleteDependenceCombo,
        softDeleteDependenceComboLoading,
        updateDependenceCombo,
        updateDependenceComboLoading,
        dependenceComboSchema,
        combosData: combosData?.comercial_Combos,
        combosRefetch,
        combosLoading
      }}
    >
      {children}
    </DependenceComboContext.Provider>
  )
}

export const useDependenceCombo = () => {
  return useContext(DependenceComboContext)
}
