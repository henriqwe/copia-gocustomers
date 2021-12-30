import { useForm } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as users from '@/domains/erp/identities/Clients/Tabs/Users'
import { useEffect } from 'react'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

type FormData = {
  Id: string
  Email: string
  Senha: string
}

export default function UpdateUser() {
  const {
    updateUserLoading,
    updateUser,
    setSlidePanelState,
    usersRefetch,
    userSchema,
    slidePanelState
  } = users.useUser()
  const {
    handleSubmit,
    reset,
    formState: { errors },
    register
  } = useForm({
    resolver: yupResolver(userSchema)
  })
  const onSubmit = (formData: FormData) => {
    updateUser({
      variables: {
        Id: slidePanelState.data?.Id,
        Email: formData.Email,
        Senha: formData.Senha
      }
    })
      .then(() => {
        usersRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false }
        })
        notification('Usuário editado com sucesso', 'success')
      })
      .catch((err) => {
        showError(err)
      })
  }

  useEffect(() => {
    reset({
      Email: slidePanelState.data?.Email,
      Senha: slidePanelState.data?.Senha
    })
  }, [slidePanelState.data, reset])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      data-testid="editForm"
      className="flex flex-col items-end"
    >
      <div className="flex flex-col w-full gap-2 mb-2">
        <form.Input
          fieldName="Email"
          type="email"
          register={register}
          title="Email"
          error={errors.Email}
          data-testid="createEmail"
        />
        <form.Input
          fieldName="Senha"
          type="password"
          register={register}
          title="Senha"
          error={errors.Senha}
          data-testid="createSenha"
        />
      </div>
      <common.Separator />
      <buttons.PrimaryButton
        title="Editar"
        disabled={updateUserLoading}
        loading={updateUserLoading}
      />
    </form>
  )
}
