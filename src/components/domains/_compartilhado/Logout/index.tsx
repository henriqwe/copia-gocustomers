import { Dispatch, SetStateAction } from 'react'
import { Auth } from 'aws-amplify'

import * as common from '@/common'

import rotas from '@/domains/routes'
import router from 'next/router'

type LogoutProps = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  disabled: boolean
  setDisabled: Dispatch<SetStateAction<boolean>>
}

const Logout = ({ disabled, open, setDisabled, setOpen }: LogoutProps) => (
  <common.Modal
    onClose={() => {
      setOpen(false)
    }}
    open={open}
    buttonTitle="Sair"
    modalTitle="Quer realmente sair do sistema?"
    description="Tera que fazer login novamente para usar o sistema!"
    handleSubmit={async () => {
      setDisabled(true)
      await Auth.signOut().then(() => {
        setDisabled(false)
        setOpen(false)
        router.push(rotas.login)
      })
    }}
    disabled={disabled}
  />
)

export default Logout
