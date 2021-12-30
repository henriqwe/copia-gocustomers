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
import { CPFValidation, CNPJValidation } from 'utils/validation'
import * as yup from 'yup'

type CollaboratorContextProps = {
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  collaboratorsData?: {
    Id: string
    Pessoa: {
      Nome: string
    }
  }[]

  collaboratorsRefetch: () => void
  collaboratorsLoading: boolean
  // usersRefetch: () => void
  createCollaborator: (
    options?: MutationFunctionOptions<
      {
        CadastrarColaborador?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createCollaboratorLoading: boolean
  softDeleteCollaboratorLoading: boolean
  softDeleteCollaborator: (
    options?: MutationFunctionOptions<
      {
        update_identidades_Colaboradores_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updateCollaboratorsLoading: boolean
  updateCollaborators: (
    options?: MutationFunctionOptions<
      {
        update_identidades_Colaboradores_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>

  CNPJSchema: any
  CPFSchema: any
}

type ProviderProps = {
  children: ReactNode
}

type SlidePanelStateType = {
  type: 'create' | 'update'
  data?: GraphQLTypes['identidades_Colaboradores'] | null
  open: boolean
}

export const CollaboratorContext = createContext<CollaboratorContextProps>(
  {} as CollaboratorContextProps
)

export const CollaboratorProvider = ({ children }: ProviderProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    type: 'create',
    open: false
  })

  const [createCollaborator, { loading: createCollaboratorLoading }] =
    useTypedMutation({
      CadastrarColaborador: [
        {
          Identificador: $`Identificador`,
          PessoaJuridica: $`PessoaJuridica`
        },
        {
          Id: true
        }
      ]
    })

  const [updateCollaborators, { loading: updateCollaboratorsLoading }] =
    useTypedMutation({
      update_identidades_Colaboradores_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            Pessoa_Id: $`Pessoa_Id`,
            updated_at: new Date()
          }
        },
        { Id: true }
      ]
    })

  const [softDeleteCollaborator, { loading: softDeleteCollaboratorLoading }] =
    useTypedMutation({
      update_identidades_Colaboradores_by_pk: [
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
    data: collaboratorsData,
    refetch: collaboratorsRefetch,
    loading: collaboratorsLoading
  } = useTypedQuery(
    {
      identidades_Colaboradores: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          Pessoa: {
            Nome: true,
            Identificador: true
          }
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const CPFSchema = yup.object().shape({
    Identificador: yup
      .string()
      .required('Preencha o campo para continuar')
      .test('equal', 'Complete todos os campos', (val: string | undefined) => {
        return val?.toString().substring(13, 15) !== '_'
      })
      .test('equal', 'Digite um cpf válido', (val: string | undefined) => {
        return CPFValidation(val as string)
      })
  })

  const CNPJSchema = yup.object().shape({
    Identificador: yup
      .string()
      .required('Preencha o campo para continuar')
      .test('equal', 'Complete todos os campos', (val: string | undefined) => {
        return val?.toString().substring(17, 18) !== '_'
      })
      .test('equal', 'Digite um cnpj válido', (val: string | undefined) => {
        return CNPJValidation(val as string)
      })
  })
  return (
    <CollaboratorContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        collaboratorsData: collaboratorsData?.identidades_Colaboradores,
        collaboratorsRefetch,
        collaboratorsLoading,
        createCollaborator,
        createCollaboratorLoading,
        softDeleteCollaboratorLoading,
        softDeleteCollaborator,
        updateCollaboratorsLoading,
        updateCollaborators,
        CPFSchema,
        CNPJSchema
      }}
    >
      {children}
    </CollaboratorContext.Provider>
  )
}

export const useCollaborator = () => {
  return useContext(CollaboratorContext)
}
