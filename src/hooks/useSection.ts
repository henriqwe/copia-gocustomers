import { Auth } from 'aws-amplify'
import { useRouter } from 'next/dist/client/router'
import { useEffect, useState } from 'react'

export const useSection = () => {
  const router = useRouter()
  const [user, setUser] = useState()

  useEffect(() => {
    checkUser()
    
  }, [])

  async function checkUser() {
    try {
      const response = await Auth.currentAuthenticatedUser()
      setUser(response)
    } catch (error) {
      router.push('/login')
    }
  }
  return user
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
