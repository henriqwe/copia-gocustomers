import { useForm } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as users from '@/domains/erp/identities/Clients/Tabs/Users'
import * as client from '@/domains/erp/identities/Clients'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

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
    clientsData
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
