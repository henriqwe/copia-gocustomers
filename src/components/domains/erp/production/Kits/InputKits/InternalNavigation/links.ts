import rotas from '@/domains/routes'

export const links = [
  {
    title: 'Kits de insumo',
    url: rotas.erp.producao.kits.kitsDeInsumo.index
  },
  {
    title: 'Tipos de Kits',
    url: rotas.erp.producao.kits.kitsDeInsumo.tipos.index
  }
]
