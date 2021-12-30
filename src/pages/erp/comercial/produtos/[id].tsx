import rotas from '@/domains/routes'

import { useSection } from 'hooks/useSection'
import FormAndTabs from '@/templates/FormAndTabs'

import * as products from '@/domains/erp/commercial/Products'
import * as combos from '@/domains/erp/commercial/Combos'
import * as attributes from '@/domains/erp/commercial/Registration/Attributes'

export default function UpdateProduct() {
  const user = useSection()
  if (!user) return null
  return (
    <products.UpdateProvider>
      <products.ProductProvider>
        <products.products.ProductProvider>
          <products.services.ServiceProvider>
            <products.upSelling.UpSellingProvider>
              <products.attributes.AttributeProvider>
                <combos.ListProvider>
                  <attributes.AttributeProvider>
                    <Page />
                  </attributes.AttributeProvider>
                </combos.ListProvider>
              </products.attributes.AttributeProvider>
            </products.upSelling.UpSellingProvider>
          </products.services.ServiceProvider>
        </products.products.ProductProvider>
      </products.ProductProvider>
    </products.UpdateProvider>
  )
}

function Page() {
  const { productLoading, productRefetch } = products.useUpdate()
  const { productsRefetch } = products.products.useProduct()
  const { servicesRefetch } = products.services.useService()
  const { upSellingRefetch } = products.upSelling.useUpSelling()
  const { attributesRefetch } = products.attributes.useAttribute()
  const { combosRefetch } = combos.useList()
  const { attributeRefetch } = attributes.useAttribute()

  const refetch = () => {
    productsRefetch()
    servicesRefetch()
    upSellingRefetch()
    combosRefetch()
    attributesRefetch()
    attributeRefetch()
    productRefetch()
  }

  return (
    <FormAndTabs
      Form={<products.Update />}
      title="Produtos"
      reload={{
        action: refetch,
        state: productLoading
      }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Comercial', url: rotas.erp.comercial.index },
        {
          title: 'Produtos',
          url: rotas.erp.comercial.produtos
        }
      ]}
    >
      <products.Tabs />
    </FormAndTabs>
  )
}
