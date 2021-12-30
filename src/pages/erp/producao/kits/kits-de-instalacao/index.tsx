import { useSection } from 'hooks/useSection'

import * as installationKits from '@/domains/erp/production/Kits/InstallationKits'

import rotas from '@/domains/routes'
import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'

export default function InstallationKits() {
  const user = useSection()
  if (!user) return null
  return (
    <installationKits.ListProvider>
      <Page />
    </installationKits.ListProvider>
  )
}

export function Page() {
  const { installationKitsRefetch, installationKitsLoading } =
    installationKits.useList()
  //const { usuario } = useUsuario()
  return (
    <InternalNavigationAndSlide
      SubMenu={<installationKits.InternalNavigation />}
      title="Kits de instalação de produção"
      reload={{
        action: installationKitsRefetch,
        state: installationKitsLoading
      }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        {
          title: 'Produção',
          url: rotas.erp.producao.identificaveis.chips.index
        },
        {
          title: 'Kits de instalação',
          url: rotas.erp.producao.kits.kitsDeInstalacao.index
        }
      ]}
    >
      <installationKits.List />
    </InternalNavigationAndSlide>
  )
}
