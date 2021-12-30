import rotas from '@/domains/routes'

export function Actions() {
  const actions = [
    {
      title: 'Fornecedor',
      url: rotas.erp.identidades.fornecedores.cadastrar
    }
  ]
  return actions
}
