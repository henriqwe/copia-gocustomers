import { useSection } from 'hooks/useSection'

import * as itens from '@/domains/erp/inventory/Itens'
import * as families from '@/domains/erp/inventory/Registration/Families'
import * as groups from '@/domains/erp/inventory/Registration/Groups'
import * as manufacturers from '@/domains/erp/inventory/Registration/Manufacturers'
import * as products from '@/domains/erp/purchases/Products'
import * as addressing from '@/domains/erp/inventory/Registration/Addresses'
import * as models from '@/domains/erp/inventory/Registration/Models'

import rotas from '@/domains/routes'

import Base from '@/templates/Base'

export default function Itens() {
  const user = useSection()
  if (!user) return null
  return (
    <itens.CreateProvider>
      <manufacturers.ManufacturerProvider>
        <families.FamilyProvider>
          <groups.GroupProvider>
            <products.ListProvider>
              <addressing.AddressingProvider>
                <models.ModelProvider>
                  <Page />
                </models.ModelProvider>
              </addressing.AddressingProvider>
            </products.ListProvider>
          </groups.GroupProvider>
        </families.FamilyProvider>
      </manufacturers.ManufacturerProvider>
    </itens.CreateProvider>
  )
}

export function Page() {
  const { manufacturersRefetch, manufacturersLoading } =
    manufacturers.useManufacturer()
  const { familiesRefetch, parentsFamiliesRefetch } = families.useFamily()
  const { groupsRefetch } = groups.useGroup()
  const { productsRefetch } = products.useList()
  const { adresssesRefetch } = addressing.useAddressing()
  const { modelsRefetch } = models.useModel()

  const refetch = () => {
    modelsRefetch()
    adresssesRefetch()
    productsRefetch()
    groupsRefetch()
    parentsFamiliesRefetch()
    familiesRefetch()
    manufacturersRefetch()
  }
  return (
    <Base
      title="Cadastro de item"
      reload={{ action: refetch, state: manufacturersLoading }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Compras', url: rotas.erp.compras.index },
        { title: 'Itens', url: rotas.erp.estoque.itens.index },
        {
          title: 'Cadastro',
          url: rotas.erp.estoque.itens.cadastrar
        }
      ]}
    >
      <itens.Create />
    </Base>
  )
}
