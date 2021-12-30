import { useEffect, useState } from 'react'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as collaborators from '@/domains/erp/identities/Collaborators'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

type FormData = {
  Nome: string
  Identificador: string
  RazaoSocial: string
  CEP: string
  Logradouro: string
  Numero: string
  Bairro: string
  Cidade: string
  Estado: string
}

export default function UpdatePerson() {
  const [edicaoAtivada, setEdicaoAtivada] = useState(false)

  const {
    collaboratorData,
    collaboratorLoading,
    collaboratorRefetch,
    updatePerson,
    updatePersonLoading,
    pessoaSchema
  } = collaborators.useUpdate()

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm({ resolver: yupResolver(pessoaSchema) })

  function onSubmit(fomData: FormData) {
    updatePerson({
      variables: {
        Id: collaboratorData?.Pessoa.Id,
        Nome: fomData.Nome,
        Identificador: fomData.Identificador
      }
    })
      .then(() => {
        collaboratorRefetch()
        setEdicaoAtivada(false)
        notification(fomData.Nome + ' editado com sucesso', 'success')
      })
      .catch((err) => {
        showError(err)
      })
  }

  useEffect(() => {
    reset({
      Nome: collaboratorData?.Pessoa.Nome || '',
      Identificador: collaboratorData?.Pessoa.Identificador
    })
  }, [collaboratorData, reset])

  return (
    <div className="flex flex-col gap-4">
      <common.Card>
        <common.GenericTitle
          title="Dados gerais"
          subtitle="Dados básicos do Colaborador"
          className="px-6"
        />
        <common.Separator className="mb-0" />
        <form>
          <form.FormLine position={1} grid={2}>
            <form.Input
              fieldName="Nome"
              title="Nome"
              register={register}
              error={errors.Nome}
              disabled={!edicaoAtivada}
            />
            {collaboratorData?.Pessoa.PessoaJuridica ? (
              <form.CNPJInput
                register={register}
                error={errors.Identificador}
                control={control}
                disabled={true}
              />
            ) : (
              <form.CPFInput
                register={register}
                error={errors.Identificador}
                control={control}
                disabled={true}
              />
            )}
          </form.FormLine>
          <form.FormLine grid={1} position={2}>
            {collaboratorData?.Pessoa.PessoaJuridica && (
              <form.Input
                fieldName="RazaoSocial"
                title="Razão social"
                register={register}
                error={errors.razaoSocial}
                disabled={!edicaoAtivada}
              />
            )}
          </form.FormLine>
          <div className="flex items-center justify-between w-full px-6">
            <buttons.GoBackButton />
            <div className="flex gap-2">
              {edicaoAtivada && (
                <buttons.CancelButton
                  onClick={() => {
                    setEdicaoAtivada(false)
                  }}
                />
              )}
              <buttons.PrimaryButton
                title={edicaoAtivada ? 'Atualizar' : 'Editar'}
                disabled
                loading={collaboratorLoading || updatePersonLoading}
                onClick={() => {
                  event?.preventDefault()
                  if (!edicaoAtivada) {
                    setEdicaoAtivada(true)
                    return
                  }
                  handleSubmit(onSubmit)()
                }}
              />
            </div>
          </div>
        </form>
      </common.Card>
    </div>
  )
}
