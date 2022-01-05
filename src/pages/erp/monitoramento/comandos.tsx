import rotas from '@/domains/routes'
import Base from '@/templates/Base'

export default function Comandos() {
  return <Page />
}

export function Page() {
  return (
    <Base
      title="Comandos"
      noGrid={true}
      currentLocation={[
        { title: 'Dashboard', url: rotas.erp.home },
        { title: 'Comandos', url: rotas.erp.monitoramento.comandos }
      ]}
    >
      <p>Comandos</p>
    </Base>
  )
}
