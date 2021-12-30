import rotas from '@/domains/routes'

export function Actions() {
  const actions = [
    {
      title: 'Proposta',
      url: rotas.erp.comercial.propostas.cadastrar
    }
  ]
  return actions
}
