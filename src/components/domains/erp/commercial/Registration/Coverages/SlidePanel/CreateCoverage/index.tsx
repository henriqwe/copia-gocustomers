import { useForm } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as coverages from '@/domains/erp/commercial/Registration/Coverages'

import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

type FormData = {
  Id: string
  Nome: string
}

export default function CreateCoverage() {
  const {
    createCoverageLoading,
    createCoverage,
    setSlidePanelState,
    coveragesRefetch,
    coverageSchema
  } = coverages.useCoverage()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(coverageSchema)
  })
  const onSubmit = (formData: FormData) => {
    createCoverage({
      variables: {
        Nome: formData.Nome
      }
    })
      .then(() => {
        coveragesRefetch()
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
        disabled={createCoverageLoading}
        loading={createCoverageLoading}
      />
    </form>
  )
}
