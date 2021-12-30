import { useSection } from 'hooks/useSection'
import BaseTemplate from '@/templates/Base'

export default function Home() {
  const sessao = useSection()
  if (!sessao) return null
  return (
    <BaseTemplate>
      <div>Teste</div>
    </BaseTemplate>
  )
}
