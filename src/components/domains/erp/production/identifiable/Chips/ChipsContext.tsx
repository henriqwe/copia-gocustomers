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

type ChipsContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  chipsData?: {
    Id: string
    Iccid: string
    NumeroDaLinha: string
    Operadora: {
      Id: string
      Nome: string
    }
    Situacao?: {
      Valor: string
      Comentario: string
    }
  }[]

  chipsRefetch: () => void
  chipsLoading: boolean
  updateChip: (
    options?: MutationFunctionOptions<
      {
        update_producao_Chips_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateChipLoading: boolean
  cancelChip: (
    options?: MutationFunctionOptions<
      {
        update_producao_Chips_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  cancelChipLoading: boolean
  suspendChip: (
    options?: MutationFunctionOptions<
      {
        update_producao_Chips_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  suspendChipLoading: boolean
  activateChip: (
    options?: MutationFunctionOptions<
      {
        update_producao_Chips_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  activateChipLoading: boolean
  softDeleteChipLoading: boolean
  softDeleteChip: (
    options?: MutationFunctionOptions<
      {
        update_producao_Chips_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  chipsSchema: any
  suspendChipsSchema: any
}

type SlidePanelStateType = {
  data?: GraphQLTypes['producao_Chips'] | null
  open: boolean
  showModal: boolean
  situation?: string
}

type ProviderProps = {
  children: ReactNode
}

export const ChipsContext = createContext<ChipsContextProps>(
  {} as ChipsContextProps
)

export const ChipsProvider = ({ children }: ProviderProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    open: false,
    showModal: false
  })

  const [updateChip, { loading: updateChipLoading }] = useTypedMutation({
    update_producao_Chips_by_pk: [
      {
        pk_columns: { Id: $`Id` },
        _set: {
          Iccid: $`Iccid`,
          NumeroDaLinha: $`NumeroDaLinha`,
          Operadora_Id: $`Operadora_Id`,
          updated_at: new Date()
        }
      },
      { Id: true }
    ]
  })

  const [cancelChip, { loading: cancelChipLoading }] = useTypedMutation({
    update_producao_Chips_by_pk: [
      {
        pk_columns: { Id: $`Id` },
        _set: {
          Situacao_Id: 'cancelado',
          updated_at: new Date()
        }
      },
      { Id: true }
    ]
  })

  const [suspendChip, { loading: suspendChipLoading }] = useTypedMutation({
    update_producao_Chips_by_pk: [
      {
        pk_columns: { Id: $`Id` },
        _set: {
          Situacao_Id: 'suspenso',
          TempoDaSuspensao: $`TempoDaSuspensao`,
          DataSuspensao: new Date(),
          updated_at: new Date()
        }
      },
      { Id: true }
    ]
  })

  const [activateChip, { loading: activateChipLoading }] = useTypedMutation({
    update_producao_Chips_by_pk: [
      {
        pk_columns: { Id: $`Id` },
        _set: {
          Situacao_Id: 'ativo',
          updated_at: new Date()
        }
      },
      { Id: true }
    ]
  })

  const [softDeleteChip, { loading: softDeleteChipLoading }] = useTypedMutation(
    {
      update_producao_Chips_by_pk: [
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
    }
  )

  const {
    data: chipsData,
    refetch: chipsRefetch,
    loading: chipsLoading
  } = useTypedQuery(
    {
      producao_Chips: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          Iccid: true,
          NumeroDaLinha: true,
          Operadora: {
            Id: true,
            Nome: true
          },
          Situacao: {
            Valor: true,
            Comentario: true
          }
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const chipsSchema = yup.object().shape({
    Iccid: yup.string().required('Preencha o campo para continuar'),
    Telefone: yup.string().required('Preencha o campo para continuar'),
    Operadora_Id: yup
      .object()
      .required('Selecione uma operadora para continuar')
  })

  const suspendChipsSchema = yup.object().shape({
    Duracao: yup.string().required('Preencha o campo para continuar')
  })

  return (
    <ChipsContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        chipsData: chipsData?.producao_Chips,
        chipsRefetch,
        chipsLoading,
        updateChip,
        updateChipLoading,
        cancelChip,
        cancelChipLoading,
        suspendChip,
        suspendChipLoading,
        activateChip,
        activateChipLoading,
        softDeleteChipLoading,
        softDeleteChip,
        chipsSchema,
        suspendChipsSchema
      }}
    >
      {children}
    </ChipsContext.Provider>
  )
}

export const useChips = () => {
  return useContext(ChipsContext)
}
