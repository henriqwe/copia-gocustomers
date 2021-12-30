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

type EquipmentContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  equipmentData?: {
    Id: string
    Imei: number
    Identificador: number
    Item: {
      Id: string
      Produto: {
        Id: string
        Nome: string
      }
    }
  }[]

  equipmentRefetch: () => void
  equipmentLoading: boolean
  softDeleteEquipmentLoading: boolean
  softDeleteEquipment: (
    options?: MutationFunctionOptions<
      {
        update_producao_Equipamentos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateEquipmentLoading: boolean
  updateEquipment: (
    options?: MutationFunctionOptions<
      {
        update_producao_Equipamentos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  equipmentSchema: any
}

type ProviderProps = {
  children: ReactNode
}

type SlidePanelStateType = {
  data?: GraphQLTypes['producao_Equipamentos'] | null
  open: boolean
}

export const EquipmentContext = createContext<EquipmentContextProps>(
  {} as EquipmentContextProps
)

export const EquipmentProvider = ({ children }: ProviderProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    open: false
  })

  const [updateEquipment, { loading: updateEquipmentLoading }] =
    useTypedMutation({
      update_producao_Equipamentos_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            Imei: $`Imei`,
            Identificador: $`Identificador`,
            updated_at: new Date()
          }
        },
        { Id: true }
      ]
    })

  const [softDeleteEquipment, { loading: softDeleteEquipmentLoading }] =
    useTypedMutation({
      update_producao_Equipamentos_by_pk: [
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
    data: equipmentData,
    refetch: equipmentRefetch,
    loading: equipmentLoading
  } = useTypedQuery(
    {
      producao_Equipamentos: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          Imei: true,
          Identificador: true,
          Item: {
            Id: true,
            Produto: {
              Id: true,
              Nome: true
            }
          }
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const equipmentSchema = yup.object().shape({
    Imei: yup
      .number()
      .test(
        'len',
        'O valor precisa ter 15 digitos',
        (val: number | undefined) => val?.toString().length === 15
      )
      .typeError('Preencha o campo com números para continuar')
      .required('Preencha o campo com para continuar')
  })

  return (
    <EquipmentContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        equipmentData: equipmentData?.producao_Equipamentos,
        equipmentRefetch,
        equipmentLoading,
        softDeleteEquipmentLoading,
        softDeleteEquipment,
        updateEquipmentLoading,
        updateEquipment,
        equipmentSchema
      }}
    >
      {children}
    </EquipmentContext.Provider>
  )
}

export const useEquipment = () => {
  return useContext(EquipmentContext)
}
