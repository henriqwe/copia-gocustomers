import rotas from '@/domains/routes'

export function Actions() {
  const actions = [
    {
      title: 'Chips',
      url: rotas.erp.producao.identificaveis.chips.cadastrar
    }
  ]
  return actions
}
