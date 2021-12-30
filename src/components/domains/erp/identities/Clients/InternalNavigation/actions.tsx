import rotas from '@/domains/routes'

export function Actions() {
  const actions = [
    {
      title: 'Cliente',
      url: rotas.erp.identidades.clientes.cadastrar
    }
  ]
  return actions
}
