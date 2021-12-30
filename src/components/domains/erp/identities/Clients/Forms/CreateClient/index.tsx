import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { GraphQLTypes } from 'graphql/generated/zeus'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'

import rotas from '@/domains/routes'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as clients from '@/domains/erp/identities/Clients'
import { PhysicalPerson } from './physicalPerson'
import { LegalPerson } from './legalPerson'
import { identifierUnformat } from 'utils/formaters'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

type FormType = Pick<GraphQLTypes['identidades_Pessoas'], 'Identificador'>

export default function CreateClient() {
  const router = useRouter()
  const {
    createClientLoading,
    createClient,
    CPFSchema,
    CNPJSchema
    // BuscarPessoa,
  } = clients.useCreate()
  const [kindOfPerson, setKindOfPerson] = useState('')

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    reset
  } = useForm({
    resolver: yupResolver(kindOfPerson !== 'pj' ? CPFSchema : CNPJSchema)
  })

  async function onSubmit(formData: FormType) {
    await createClient({
      variables: {
        Identificador: identifierUnformat(formData.Identificador),
        PessoaJuridica: kindOfPerson !== 'pj' ? false : true
      }
    })
      .then((resposta) => {
        router.push(
          `${rotas.erp.identidades.clientes.index}/${resposta?.data.CadastrarCliente.Id}`
        )

        notification(
          formData.Identificador + ' cadastrado com sucesso',
          'success'
        )
      })
      .catch((erros) => showError(erros))
  }

  useEffect(() => {
    reset({
      Identificador: ''
    })
  }, [reset, kindOfPerson])

  return (
    <common.Card>
      <common.GenericTitle
        title={'CPF ou CNPJ'}
        subtitle={
          'Informe o identificador do cliente para continuar o cadastro.'
        }
        className="px-6"
      />
      <common.Separator />
      <form onSubmit={handleSubmit(onSubmit)}>
        <form.FormLine grid={2} position={1}>
          <div className="flex items-center justify-center p-8">
            <section className="w-9/12 gap-2 text-center">
              <h4 className="mb-4 font-normal text-gray-800 dark:text-gray-400">
                Para seguir com o cadastro, selecione o{' '}
                <span className="text-theme-11">tipo de cliente </span>
                que será cadastrado
              </h4>
              <common.ListRadioGroup
                options={[
                  {
                    value: 'pf',
                    content: <PhysicalPerson />
                  },
                  {
                    value: 'pj',
                    content: <LegalPerson />
                  }
                ]}
                setSelectedOption={setKindOfPerson}
              />
            </section>
          </div>
          <div className="flex items-center justify-center flex-1 w-full">
            <section className="flex flex-col w-9/12 gap-2">
              <h4 className="font-light text-gray-900 dark:text-gray-400">
                Informe o número do documento
              </h4>
              {kindOfPerson !== 'pf' ? (
                <form.CNPJInput
                  register={register}
                  error={errors.Identificador}
                  control={control}
                  disabled={kindOfPerson === ''}
                />
              ) : (
                <form.CPFInput
                  register={register}
                  error={errors.Identificador}
                  control={control}
                />
              )}
            </section>
          </div>
        </form.FormLine>
        <div className="flex items-center justify-between w-full px-6 mt-4">
          <buttons.GoBackButton />
          <buttons.PrimaryButton
            title="Cadastrar"
            disabled={createClientLoading}
            loading={createClientLoading}
            // disabled={kindOfPerson !== ''}
          />
        </div>
      </form>
    </common.Card>
  )
}
