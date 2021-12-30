import rotas from '@/domains/routes'

export const links = [
  {
    title: 'Produtos',
    url: rotas.erp.compras.produtos.index
  },
  {
    title: 'Pedidos',
    url: rotas.erp.compras.pedidos.index
  }
]
