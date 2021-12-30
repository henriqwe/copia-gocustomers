import { useSection } from 'hooks/useSection'
import BaseTemplate from '@/templates/Base'
import rotas from '@/domains/routes'

export default function Home() {
  const sessao = useSection()
  if (!sessao) return null
  return (
    <BaseTemplate
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Compras', url: rotas.erp.compras.index },
        {
          title: 'Dashboard',
          url: rotas.erp.estoque.index
        }
      ]}
    >
      <div>Teste</div>
    </BaseTemplate>
  )
}
