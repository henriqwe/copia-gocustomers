import { useForm } from 'react-hook-form'

import * as common from '@/common'
import * as form from '@/common/Form'
import * as collaborators from '@/domains/erp/identities/Collaborators'
import { useEffect } from 'react'

export default function UpdateCollaborators() {
  const { slidePanelState } = collaborators.useCollaborator()
  const { register, reset, control } = useForm()

  useEffect(() => {
    reset({
      Identificador: slidePanelState.data?.Pessoa.Identificador
    })
  }, [slidePanelState.data, reset])

  return (
    <form data-testid="editForm" className="flex flex-col items-end">
      <div className="flex flex-col w-full gap-2 mb-2">
        <form.Select
          itens={[]}
          value={{
            key: slidePanelState.data?.Pessoa?.Id || '',
            title: slidePanelState.data?.Pessoa?.Nome || ''
          }}
          onChange={() => null}
          disabled
          label="Colaborador"
        />

        <form.CPFInput register={register} control={control} disabled />
      </div>
      <common.Separator />
    </form>
  )
}
