import { useSection } from 'hooks/useSection'

import * as addresses from '@/domains/erp/inventory/Registration/Addresses'
import * as addressingTypes from '@/domains/erp/inventory/Registration/Addresses/AddressingTypes'

import rotas from '@/domains/routes'
import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'

export default function Addresses() {
  const user = useSection()
  if (!user) return null
  return (
    <addressingTypes.AddressingTypeProvider>
      <addresses.AddressingProvider>
        <Page />
      </addresses.AddressingProvider>
    </addressingTypes.AddressingTypeProvider>
  )
}

export function Page() {
  const { adresssesRefetch, adresssesLoading } = addresses.useAddressing()
  const { addressingTypesRefetch } = addressingTypes.useAddressingType()

  const refetch = () => {
    addressingTypesRefetch()
    adresssesRefetch()
  }
  return (
    <InternalNavigationAndSlide
      SubMenu={<addresses.InternalNavigation />}
      title="Endereçamentos de estoque"
      reload={{
        action: refetch,
        state: adresssesLoading
      }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Estoque', url: rotas.erp.estoque.index },
        {
          title: 'Endereçamento',
          url: rotas.erp.estoque.cadastros.enderecamentos.index
        }
      ]}
    >
      <addresses.List />
      <addresses.SlidePanel />
    </InternalNavigationAndSlide>
  )
}
