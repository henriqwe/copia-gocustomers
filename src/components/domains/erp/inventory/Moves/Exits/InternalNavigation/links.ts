import rotas from '@/domains/routes'

export const links = [
  {
    title: 'Movimentações',
    url: rotas.erp.estoque.movimentacoes.index
  },
  {
    title: 'Entradas pendentes',
    url: rotas.erp.estoque.movimentacoes.entradas.index
  },
  {
    title: 'Saídas pendentes',
    url: rotas.erp.estoque.movimentacoes.saidas.index
  }
]
