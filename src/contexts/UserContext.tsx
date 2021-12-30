//import { Auth } from 'aws-amplify'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { createContext, ReactNode, useContext } from 'react'

type ProvedorProps = {
  children: ReactNode
}

type UserContextProps = {
  user: any
  setUser: Dispatch<SetStateAction<undefined>>
}

export const UserContext = createContext<UserContextProps>(
  {} as UserContextProps
)

export const UserProvider = ({ children }: ProvedorProps) => {
  const [user, setUser] = useState()

  useEffect(() => {
    // FIXME resolver erro: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
    // buscaDadosDeUsuarioLogado()
  }, [])

  // async function buscaDadosDeUsuarioLogado() {
  //   const response = await Auth.currentAuthenticatedUser()
  //   setUsuario(response)
  // }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  return useContext(UserContext)
}

// export async function getServerSideProps({ ctx, req }) {
//   const { Auth } = withSSRContext({ ctx })
//   const user = await Auth.currentAuthenticatedUser().catch((error) => {
//     console.log(error)
//     // if (ctx.res) {
//     //   ctx.res.writeHead(302, { Location: '/login' })
//     //   ctx.res.end()
//     // }
//   })
//   return {
//     props: {}
//   }
// }
