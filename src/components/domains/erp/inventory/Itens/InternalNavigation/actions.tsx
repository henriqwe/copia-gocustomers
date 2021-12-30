import rotas from '@/domains/routes'

export function Actions() {
  const actions = [
    {
      title: 'Cadastrar item',
      url: rotas.erp.estoque.itens.cadastrar
    }
  ]
  return actions
}
