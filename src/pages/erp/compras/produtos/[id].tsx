import { useSection } from 'hooks/useSection'

import * as products from '@/domains/erp/purchases/Products'

import rotas from '@/domains/routes'

import FormAndTabs from '@/templates/FormAndTabs'

export default function ProductDetails() {
  const usuario = useSection()
  if (!usuario) return null
  return (
    <products.UpdateProvider>
      <Page />
    </products.UpdateProvider>
  )
}

export function Page() {
  const {
    //logRefetch,
    updateProductLoading,
    productRefetch,
    productData
  } = products.useUpdate()
  function refetch() {
    //logRefetch()
    productRefetch()
  }
  return (
    <FormAndTabs
      Form={<products.Update />}
      title={`${productData?.Nome}`}
      reload={{ action: refetch, state: updateProductLoading }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Pedidos de Compra', url: rotas.erp.compras.index },
        {
          title: 'Produtos',
          url: rotas.erp.compras.produtos.cadastrar
        }
      ]}
    >
      <div />
      {/* <produtos.ListarLogs /> */}
    </FormAndTabs>
  )
}
