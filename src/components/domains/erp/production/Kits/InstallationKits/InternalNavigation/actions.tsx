import rotas from '@/domains/routes'

export function Actions() {
  const actions = [
    {
      title: 'Kit de instalação',
      url: rotas.erp.producao.kits.kitsDeInstalacao.cadastrar
    }
  ]
  return actions
}
