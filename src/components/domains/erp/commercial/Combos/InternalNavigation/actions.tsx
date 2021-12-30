import rotas from '@/domains/routes'

export function Actions() {
  const actions = [
    {
      title: 'Combo',
      url: rotas.erp.comercial.combos.cadastrar
    }
  ]
  return actions
}
