import rotas from '@/domains/routes'

export const links = [
  { title: 'Grupos', url: rotas.erp.estoque.cadastros.grupos },
  { title: 'Famílias', url: rotas.erp.estoque.cadastros.familias },
  {
    title: 'Fabricantes',
    url: rotas.erp.estoque.cadastros.fabricantes
  },
  {
    title: 'Endereçamentos',
    url: rotas.erp.estoque.cadastros.enderecamentos.index
  },
  {
    title: 'Modelo',
    url: rotas.erp.estoque.cadastros.modelos
  }
]
