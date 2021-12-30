import { useForm } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as tariffs from '@/domains/erp/commercial/Registration/Tariffs'

import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

type FormData = {
  Id: string
  Nome: string
}

export default function CreateTariff() {
  const {
    createTariffLoading,
    createTariff,
    setSlidePanelState,
    tariffsRefetch,
    tariffSchema
  } = tariffs.useTariffs()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(tariffSchema)
  })
  const onSubmit = (formData: FormData) => {
    createTariff({
      variables: {
        Nome: formData.Nome
      }
    })
      .then(() => {
        tariffsRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false }
        })
        notification(formData.Nome + ' cadastrado com sucesso', 'success')
      })
      .catch((err) => {
        showError(err)
      })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      data-testid="inserirForm"
      className="flex flex-col items-end"
    >
      <div className="flex flex-col w-full gap-2 mb-2">
        <form.Input
          fieldName="Nome"
          register={register}
          title="Nome"
          error={errors.Nome}
          data-testid="editNome"
        />
      </div>
      <common.Separator />
      <buttons.PrimaryButton
        title="Enviar"
        disabled={createTariffLoading}
        loading={createTariffLoading}
      />
    </form>
  )
}
