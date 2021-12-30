import { useSection } from 'hooks/useSection'

import * as equipments from '@/domains/erp/production/identifiable/Equipments'

import rotas from '@/domains/routes'

import Base from '@/templates/Base'

export default function Equipments() {
  const user = useSection()
  if (!user) return null
  return (
    <equipments.CreateProvider>
      <Page />
    </equipments.CreateProvider>
  )
}

export function Page() {
  return (
    <Base
      title="Cadastro de equipamentos"
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        {
          title: 'Produção',
          url: rotas.erp.producao.identificaveis.chips.index
        },
        {
          title: 'Equipamentos',
          url: rotas.erp.producao.identificaveis.equipamentos.index
        },
        {
          title: 'Cadastro',
          url: rotas.erp.producao.identificaveis.equipamentos.cadastrar
        }
      ]}
    >
      <equipments.Create />
    </Base>
  )
}
