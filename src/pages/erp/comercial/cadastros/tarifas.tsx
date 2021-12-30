import { useSection } from 'hooks/useSection'

import * as tariffs from '@/domains/erp/commercial/Registration/Tariffs'

import rotas from '@/domains/routes'
import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'

export default function Tariffs() {
  const user = useSection()
  if (!user) return null
  return (
    <tariffs.TariffsProvider>
      <Page />
    </tariffs.TariffsProvider>
  )
}

export function Page() {
  const { tariffsRefetch, tariffsLoading } = tariffs.useTariffs()
  const refetch = () => {
    tariffsRefetch()
  }
  //const { usuario } = useUsuario()
  return (
    <InternalNavigationAndSlide
      SubMenu={<tariffs.InternalNavigation />}
      title="Tarifas"
      reload={{ action: refetch, state: tariffsLoading }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Comercial', url: rotas.erp.comercial.index },
        {
          title: 'Cadastros',
          url: rotas.erp.comercial.cadastros.index
        },
        {
          title: 'Tarifas',
          url: rotas.erp.comercial.cadastros.tarifas
        }
      ]}
    >
      <tariffs.List />
      <tariffs.SlidePanel />
    </InternalNavigationAndSlide>
  )
}
