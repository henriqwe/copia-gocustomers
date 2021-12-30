import { Auth } from 'aws-amplify'
import * as buttons from '@/common/Buttons'
import rotas from '@/domains/routes'
import Authentication from '@/templates/Authentication'
import { useRouter } from 'next/dist/client/router'
import { useState } from 'react'

type State = {
  nomeDeUsuario?: string
  senha?: string
}

export default function Login() {
  const [state, setState] = useState<State>()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const handleSignIn = async () => {
    setLoading(true)
    await Auth.signIn(state?.nomeDeUsuario as string, state?.senha, {
      aplicacao_id: '1'
    })
      .then(() => {
        setLoading(false)
        router.push(rotas.erp.home)
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }

  return (
    <Authentication
      leftContent={
        <>
          <img
            alt="GoERP"
            className="w-1/2 -mt-16 -intro-x"
            src="/dist/images/illustration.svg"
          />
          <div className="mt-10 text-4xl font-medium leading-tight text-white -intro-x">
            Mais alguns clicks para
            <br />
            entrar com sua conta.
          </div>
          <div className="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-gray-500">
            GoERP - Grupo Comigo
          </div>
        </>
      }
      rightContent={
        <>
          <h2 className="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
            Entrar
          </h2>
          <div className="mt-2 text-center text-gray-500 intro-x xl:hidden">
            Mais alguns clicks para entrar com sua conta.
          </div>
          <div className="mt-8 intro-x">
            <input
              type="text"
              onChange={(e) => {
                setState({ ...state, nomeDeUsuario: e.target.value })
              }}
              className="block px-4 py-3 border-gray-300 intro-x login__input form-control"
              placeholder="Email"
            />
            <input
              type="password"
              onChange={(e) => {
                setState({ ...state, senha: e.target.value })
              }}
              className="block px-4 py-3 mt-4 border-gray-300 intro-x login__input form-control"
              placeholder="Password"
            />
          </div>
          <div className="flex mt-4 text-xs text-gray-700 intro-x dark:text-gray-600 sm:text-sm">
            <div className="flex items-center mr-auto">
              <input
                id="remember-me"
                type="checkbox"
                className="mr-2 border form-check-input"
              />
              <label
                className="cursor-pointer select-none"
                htmlFor="remember-me"
              >
                Lembrar de mim!
              </label>
            </div>
            <a href="">Esqueceu sua senha?</a>
          </div>
          <div className="mt-5 text-center intro-x xl:mt-8 xl:text-left">
            <buttons.PrimaryButton
              title="Login"
              onClick={handleSignIn}
              className="w-full px-4 py-3 align-top btn btn-primary xl:w-32 xl:mr-3"
              disabled={loading}
              loading={loading}
            />
            {/* <button className="w-full px-4 py-3 mt-3 align-top btn btn-outline-secondary xl:w-32 xl:mt-0">
              Cadastro
            </button> */}
          </div>
          <div className="mt-10 text-center text-gray-700 intro-x xl:mt-24 dark:text-gray-600 xl:text-left">
            Para entrar, vc deve concordar com os termos abaixo:
            <br />
            <a className="text-theme-1 dark:text-theme-10" href="">
              Termos e condições
            </a>
            <a className="text-theme-1 dark:text-theme-10" href="">
              {' e '}
              Política de privacidade
            </a>
          </div>
        </>
      }
    />
  )
}
