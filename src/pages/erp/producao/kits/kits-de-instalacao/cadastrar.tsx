import { useSection } from 'hooks/useSection'

import * as installationKits from '@/domains/erp/production/Kits/InstallationKits'
import * as trackers from '@/domains/erp/production/Trackers'

import rotas from '@/domains/routes'

import Base from '@/templates/Base'

export default function CreateInstallationKit() {
  const user = useSection()
  if (!user) return null
  return (
    <installationKits.CreateProvider>
      <trackers.ListProvider>
        <Page />
      </trackers.ListProvider>
    </installationKits.CreateProvider>
  )
}

export function Page() {
  const { trackersRefetch, trackersLoading } = trackers.useList()
  return (
    <Base
      title="Cadastro de Kit de instalação"
      reload={{ action: trackersRefetch, state: trackersLoading }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        {
          title: 'Produção',
          url: rotas.erp.producao.identificaveis.chips.index
        },
        {
          title: 'Kits de Instalação',
          url: rotas.erp.producao.kits.kitsDeInstalacao.index
        },
        {
          title: 'Cadastro',
          url: rotas.erp.producao.kits.kitsDeInstalacao.cadastrar
        }
      ]}
    >
      <installationKits.Create />
    </Base>
  )
}
