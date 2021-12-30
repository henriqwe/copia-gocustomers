import { useSection } from 'hooks/useSection'

import * as addressingTypes from '@/domains/erp/inventory/Registration/Addresses/AddressingTypes'

import rotas from '@/domains/routes'
import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'

export default function AddressingTypes() {
  const user = useSection()
  if (!user) return null
  return (
    <addressingTypes.AddressingTypeProvider>
      <Page />
    </addressingTypes.AddressingTypeProvider>
  )
}

export function Page() {
  const { addressingTypesRefetch, addressingTypesLoading } =
    addressingTypes.useAddressingType()
  //const { usuario } = useUsuario()
  return (
    <InternalNavigationAndSlide
      SubMenu={<addressingTypes.InternalNavigation />}
      title="Tipos de Endereçamentos de estoque"
      reload={{
        action: addressingTypesRefetch,
        state: addressingTypesLoading
      }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Estoque', url: rotas.erp.estoque.index },
        {
          title: 'Endereçamento',
          url: rotas.erp.estoque.cadastros.enderecamentos.index
        },
        {
          title: 'Tipos',
          url: rotas.erp.estoque.cadastros.enderecamentos.tipos
        }
      ]}
    >
      <addressingTypes.List />
      <addressingTypes.SlidePanel />
    </InternalNavigationAndSlide>
  )
}
