import { useEffect, useState } from 'react'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'
import { PhysicalPerson } from '@/domains/erp/identities/Clients/Forms/CreateClient/physicalPerson'
import { LegalPerson } from '@/domains/erp/identities/Clients/Forms/CreateClient/legalPerson'
import { GraphQLTypes } from 'graphql/generated/zeus'
import { identifierUnformat } from 'utils/formaters'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as client from '@/domains/erp/identities/Clients'
import * as proposal from '@/domains/erp/commercial/Proposals'

type FormType = Pick<GraphQLTypes['identidades_Pessoas'], 'Identificador'>

export default function CreateRepresentative() {
  const { createClient, createClientLoading, CNPJSchema, CPFSchema } =
    client.useCreate()
  const { clientsRefetch } = client.useList()
  const { setSlidePanelState } = proposal.useView()

  const [kindOfPerson, setKindOfPerson] = useState('')

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
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
      .then(() => {
        clientsRefetch()
        setSlidePanelState({ open: false })
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-center p-4">
          <section className="w-9/12 gap-2 text-center">
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
          <section className="flex flex-col w-11/12 gap-2">
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

            <div>
              <buttons.PrimaryButton
                title="Adicionar"
                disabled={createClientLoading}
                loading={createClientLoading}
                // disabled={kindOfPerson !== ''}
              />
            </div>
          </section>
        </div>
      </div>
    </form>
  )
}
