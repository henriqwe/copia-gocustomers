import { useSection } from 'hooks/useSection'

import * as families from '@/domains/erp/inventory/Registration/Families'
import * as config from '@/domains/erp/config'

import rotas from '@/domains/routes'

import Base from '@/templates/Base'

export default function Config() {
  const user = useSection()
  if (!user) return null
  return (
    <config.ConfigProvider>
      <families.FamilyProvider>
        <Page />
      </families.FamilyProvider>
    </config.ConfigProvider>
  )
}

export function Page() {
  const { configRefetch, configLoading } = config.useConfig()
  const { familiesRefetch } = families.useFamily()

  const refetch = () => {
    familiesRefetch()
    configRefetch()
  }
  return (
    <Base
      reload={{ action: refetch, state: configLoading }}
      title="Configurações"
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Configurações', url: rotas.erp.compras.index }
      ]}
    >
      <config.Main />
    </Base>
  )
}
