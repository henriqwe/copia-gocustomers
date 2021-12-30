import { useSection } from 'hooks/useSection'

import * as conditionals from '@/domains/erp/commercial/Registration/Conditionals'

import rotas from '@/domains/routes'
import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'

export default function Conditionals() {
  const user = useSection()
  if (!user) return null
  return (
    <conditionals.ConditionalProvider>
      <Page />
    </conditionals.ConditionalProvider>
  )
}

export function Page() {
  const { conditionalRefetch, conditionalLoading } =
    conditionals.useConditional()
  const refetch = () => {
    conditionalRefetch()
  }
  //const { usuario } = useUsuario()
  return (
    <InternalNavigationAndSlide
      SubMenu={<conditionals.InternalNavigation />}
      title="Condicionais"
      reload={{ action: refetch, state: conditionalLoading }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Comercial', url: rotas.erp.comercial.index },
        {
          title: 'Cadastros',
          url: rotas.erp.comercial.cadastros.index
        },
        {
          title: 'Condicionais',
          url: rotas.erp.comercial.cadastros.condicionais
        }
      ]}
    >
      <conditionals.List />
      <conditionals.SlidePanel />
    </InternalNavigationAndSlide>
  )
}
