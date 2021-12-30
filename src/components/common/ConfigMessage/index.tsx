import * as buttons from '@/common/Buttons'
import rotas from '@/domains/routes'
import { useRouter } from 'next/router'

type ConfigMessageProps = {
  children: React.ReactNode
}

function ConfigMessage({ children }: ConfigMessageProps) {
  const router = useRouter()
  return (
    <div className="flex flex-col items-center justify-center my-8">
      <p className="pb-4 text-xl">{children}</p>
      <buttons.SecondaryButton
        handler={() => router.push(rotas.erp.configuracoes.index)}
        title="Configurar"
        type="button"
      />
    </div>
  )
}

export default ConfigMessage
