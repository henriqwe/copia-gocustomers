import { useState } from 'react'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'
import { PhysicalPerson } from '../CreateClient/physicalPerson'
import { LegalPerson } from '../CreateClient/legalPerson'
import { GraphQLTypes } from 'graphql/generated/zeus'
import { identifierUnformat } from 'utils/formaters'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as client from '@/domains/erp/identities/Clients'
import * as representative from '@/domains/erp/identities/Clients/Tabs/Representative'

type FormType = Pick<GraphQLTypes['identidades_Pessoas'], 'Identificador'>

export default function CreateRepresentative() {
  const {
    createRepresentativeLoading,
    createRepresentative,
    CPFSchema,
    CNPJSchema,
    setSlidePanelState,
    representativesDataRefetch
  } = representative.useRepresentative()

  const { clientData } = client.useUpdate()

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
    await createRepresentative({
      variables: {
        Identificador: identifierUnformat(formData.Identificador),
        PessoaJuridica: kindOfPerson !== 'pj' ? false : true,
        PessoaRepresentada: clientData?.Pessoa.Id
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
        representativesDataRefetch()
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
                disabled={createRepresentativeLoading}
                loading={createRepresentativeLoading}
                // disabled={kindOfPerson !== ''}
              />
            </div>
          </section>
        </div>
      </div>
    </form>
  )
}
