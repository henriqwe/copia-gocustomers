import { Controller, useForm } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as users from '@/domains/erp/identities/Collaborators/Tabs/Users'
import * as collaborator from '@/domains/erp/identities/Collaborators'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'
import router from 'next/router'
import rotas from '@/domains/routes'

type FormData = {
  Id: string
  Email: string
  Senha: string
}

export default function CreateUser() {
  const {
    createUserLoading,
    createUser,
    setSlidePanelState,
    slidePanelState,
    usersRefetch,
    userSchema,
    collaboratorsData
  } = users.useUser()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(userSchema)
  })
  const onSubmit = (formData: FormData) => {
    createUser({
      variables: {
        Email: formData.Email,
        Senha: formData.Senha
      }
    })
      .then(() => {
        usersRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false }
        })
        notification('Usuário cadastrado com sucesso', 'success')
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
        title="Enviar"
        disabled={createUserLoading}
        loading={createUserLoading}
      />
    </form>
  )
}
