import { useState } from 'react'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'
import { PhysicalPerson } from './physicalPerson'
import { LegalPerson } from './legalPerson'
import { GraphQLTypes } from 'graphql/generated/zeus'
import { identifierUnformat } from 'utils/formaters'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as collaborators from '@/domains/erp/identities/Collaborators'

type FormType = {
  Identificador: string
}

export default function CreateRepresentative() {
  const {
    collaboratorsData,
    createCollaboratorLoading,
    createCollaborator,
    CPFSchema,
    CNPJSchema,
    setSlidePanelState,
    collaboratorsRefetch
  } = collaborators.useCollaborator()

  const [kindOfPerson, setKindOfPerson] = useState('')

  const {
    register,
    control,
    formState: { errors },
    handleSubmit
  } = useForm({
    resolver: yupResolver(kindOfPerson !== 'pj' ? CPFSchema : CNPJSchema)
  })

  async function onSubmit(formData: FormType) {
    await createCollaborator({
      variables: {
        Identificador: identifierUnformat(formData.Identificador),
        PessoaJuridica: kindOfPerson !== 'pj' ? false : true
      }
    })
      .then((/*resposta*/) => {
        notification(
          formData.Identificador + ' cadastrado com sucesso',
          'success'
        )
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false }
        })
        collaboratorsRefetch()
      })
      .catch((erros) => {
        console.log(erros)
        showError(erros)
      })
  }

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
                disabled={createCollaboratorLoading || kindOfPerson === ''}
                loading={createCollaboratorLoading}
              />
            </div>
          </section>
        </div>
      </div>
    </form>
  )
}
