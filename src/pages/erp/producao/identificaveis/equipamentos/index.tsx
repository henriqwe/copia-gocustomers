import { useSection } from 'hooks/useSection'

import * as equipments from '@/domains/erp/production/identifiable/Equipments'

import rotas from '@/domains/routes'
import InternalNavigationAndSlide from '@/templates/InternalNavigationAndSlide'

export default function Equipments() {
  const user = useSection()
  if (!user) return null
  return (
    <equipments.EquipmentProvider>
      <Page />
    </equipments.EquipmentProvider>
  )
}

export function Page() {
  const { equipmentRefetch, equipmentLoading } = equipments.useEquipment()
  //const { usuario } = useUsuario()
  return (
    <InternalNavigationAndSlide
      SubMenu={<equipments.InternalNavigation />}
      title="Equipamentos de estoque"
      reload={{
        action: equipmentRefetch,
        state: equipmentLoading
      }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        {
          title: 'Produção',
          url: rotas.erp.producao.identificaveis.chips.index
        },
        {
          title: 'Equipamentos',
          url: rotas.erp.producao.identificaveis.equipamentos.index
        }
      ]}
    >
      <equipments.List />
      <equipments.SlidePanel />
    </InternalNavigationAndSlide>
  )
}
