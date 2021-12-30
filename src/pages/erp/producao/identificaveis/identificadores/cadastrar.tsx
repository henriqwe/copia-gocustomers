import { useSection } from 'hooks/useSection'

import * as identifiers from '@/domains/erp/production/identifiable/Identifiers'

import rotas from '@/domains/routes'

import Base from '@/templates/Base'

export default function CreateIdentifiers() {
  const user = useSection()
  if (!user) return null
  return (
    <identifiers.CreateProvider>
      <Page />
    </identifiers.CreateProvider>
  )
}

export function Page() {
  return (
    <Base
      title="Cadastro de Identificadores"
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        {
          title: 'Produção',
          url: rotas.erp.producao.identificaveis.chips.index
        },
        {
          title: 'Identificadores',
          url: rotas.erp.producao.identificaveis.identificadores.index
        },
        {
          title: 'Cadastro',
          url: rotas.erp.producao.identificaveis.identificadores.cadastrar
        }
      ]}
    >
      <identifiers.Create />
    </Base>
  )
}
