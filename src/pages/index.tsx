import { useRouter } from 'next/router'
import rotas from '@/domains/routes'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push(rotas.erp.index)
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-w-full min-h-full gap-10">
      <img
        src="/imagens/logoRastreamento.png"
        alt="comigo rastreamento"
        className="w-1/3"
      />
      <img
        src="/imagens/logoAssistencia.png"
        alt="comigo assistencia"
        className="w-1/3"
      />
      <img src="/imagens/logoMaxline.png" alt="maxline" className="w-1/3" />
    </div>
  )
}
