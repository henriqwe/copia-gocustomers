import rotas from '@/domains/routes'

export function Actions() {
  const actions = [
    {
      title: 'Kit de insumo',
      url: rotas.erp.producao.kits.kitsDeInsumo.cadastrar
    }
  ]
  return actions
}
