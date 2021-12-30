import { useSection } from 'hooks/useSection'

import * as products from '@/domains/erp/purchases/Products'

import rotas from '@/domains/routes'

import Base from '@/templates/Base'

export default function CreateProduct() {
  const usuario = useSection()
  if (!usuario) return null
  return (
    <products.CreateProvider>
      <Page />
    </products.CreateProvider>
  )
}

export function Page() {
  return (
    <Base
      title="Cadastro de produto"
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Pedidos de Compra', url: rotas.erp.compras.index },
        {
          title: 'Produtos',
          url: rotas.erp.compras.produtos.index
        },
        {
          title: 'Cadastro',
          url: rotas.erp.compras.produtos.cadastrar
        }
      ]}
    >
      <products.Create />
    </Base>
  )
}
