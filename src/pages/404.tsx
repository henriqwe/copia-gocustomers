import { useRouter } from 'next/router'
import rotas from '@/domains/routes'
import { useEffect } from 'react'
import * as buttons from '@/common/Buttons'

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    document.querySelector('body')?.classList.add('p-0')
  })
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center error-page lg:flex-row lg:text-left">
      <div className="-intro-x lg:mr-20">
        <img
          alt="Rubick Tailwind HTML Admin Template"
          className="h-48 lg:h-auto max-h-96"
          src="/imagens/error-illustration.svg"
        />
      </div>
      <div className="mt-10 text-white lg:mt-0">
        <div className="font-medium intro-x text-8xl">404</div>
        <div className="mt-5 text-xl font-medium intro-x lg:text-3xl">
          Oops. Página não encontrada.
        </div>
        <div className="mt-3 text-lg intro-x">
          Você pode ter errado o endereço ou a página pode ter sido movida.
        </div>
        <div className="py-3 mt-10 intro-x">
          <buttons.PrimaryButton
            title="Voltar para o início"
            onClick={() => {
              document.querySelector('body')?.classList.remove('p-0')
              router.push(rotas.erp.index)
            }}
          />
        </div>
      </div>
    </div>
  )
}
