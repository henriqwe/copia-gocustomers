import { useSection } from 'hooks/useSection'

import * as businessProfiles from '@/domains/erp/services/BusinessProfiles'
import * as leads from '@/domains/erp/services/Leads'
import * as questionsGroups from '@/domains/erp/services/Registration/Questions/Groups'

import rotas from '@/domains/routes'
import Base from '@/templates/Base'
import { GetServerSideProps } from 'next'

type CreateBusinessProfileProps = {
  Lead_Id: string | null
  Lead_Nome: string | null
}

export default function CreateBusinessProfile({
  Lead_Id,
  Lead_Nome
}: CreateBusinessProfileProps) {
  const user = useSection()
  if (!user) return null
  return (
    <businessProfiles.CreateProvider>
      <leads.LeadProvider>
        <questionsGroups.ListProvider>
          <Page Lead_Id={Lead_Id} Lead_Nome={Lead_Nome} />
        </questionsGroups.ListProvider>
      </leads.LeadProvider>
    </businessProfiles.CreateProvider>
  )
}

export function Page({ Lead_Id, Lead_Nome }: CreateBusinessProfileProps) {
  const { leadsRefetch, leadsLoading } = leads.useLead()
  const { questionsGroupsRefetch } = questionsGroups.useList()
  const refetch = () => {
    questionsGroupsRefetch()
    leadsRefetch()
  }
  //const { usuario } = useUsuario()
  return (
    <Base
      title="Cadastro de Perfis Comerciais"
      reload={{ action: refetch, state: leadsLoading }}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Atendimento', url: rotas.erp.atendimento.index },
        {
          title: 'Perfis Comerciais',
          url: rotas.erp.atendimento.perfisComerciais.index
        },
        {
          title: 'Cadastros',
          url: rotas.erp.atendimento.cadastros.index
        }
      ]}
    >
      <businessProfiles.Create Lead_Id={Lead_Id} Lead_Nome={Lead_Nome} />
    </Base>
  )
}

export const getServerSideProps: GetServerSideProps = async (props) => {
  return {
    props: {
      Lead_Id: props.query?.Lead_Id || null,
      Lead_Nome: props.query?.Lead_Nome || null
    }
  }
}
