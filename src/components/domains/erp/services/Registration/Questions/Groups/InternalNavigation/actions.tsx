import rotas from '@/domains/routes'

export function Actions() {
  const actions = [
    {
      title: 'Grupo de perguntas',
      url: rotas.erp.atendimento.cadastros.perguntas.grupos.cadastrar
    }
  ]
  return actions
}
