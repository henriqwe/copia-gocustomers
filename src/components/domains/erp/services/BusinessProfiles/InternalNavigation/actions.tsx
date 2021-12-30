import rotas from '@/domains/routes'

export function Actions() {
  const actions = [
    {
      title: 'Perfil Comercial',
      url: rotas.erp.atendimento.perfisComerciais.cadastrar
    }
  ]
  return actions
}
