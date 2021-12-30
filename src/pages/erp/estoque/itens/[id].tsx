import { useSection } from 'hooks/useSection'

import * as itens from '@/domains/erp/inventory/Itens'
import * as families from '@/domains/erp/inventory/Registration/Families'
import * as groups from '@/domains/erp/inventory/Registration/Groups'
import * as products from '@/domains/erp/purchases/Products'
import * as addressing from '@/domains/erp/inventory/Registration/Addresses'
import * as models from '@/domains/erp/inventory/Registration/Models'

import rotas from '@/domains/routes'

import FormAndTabs from '@/templates/FormAndTabs'

export default function Produtos() {
  const usuario = useSection()
  if (!usuario) return null
  return (
    <itens.UpdateProvider>
      <families.FamilyProvider>
        <groups.GroupProvider>
          <products.ListProvider>
            <addressing.AddressingProvider>
              <models.ModelProvider>
                <Pagina />
              </models.ModelProvider>
            </addressing.AddressingProvider>
          </products.ListProvider>
        </groups.GroupProvider>
      </families.FamilyProvider>
    </itens.UpdateProvider>
  )
}

export function Pagina() {
  const { logsItensRefetch, updateItemLoading, itemRefetch, itemData } =
    itens.useUpdate()
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
    logsItensRefetch()
    itemRefetch()
  }

  return (
    <FormAndTabs
      Form={<itens.Update />}
      title={`${itemData?.Familia.Nome}`}
      reload={{ action: refetch, state: updateItemLoading }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Compras', url: rotas.erp.compras.index },
        { title: 'Itens', url: rotas.erp.estoque.itens.index }
      ]}
    >
      <div />
      <itens.LogsList />
    </FormAndTabs>
  )
}
