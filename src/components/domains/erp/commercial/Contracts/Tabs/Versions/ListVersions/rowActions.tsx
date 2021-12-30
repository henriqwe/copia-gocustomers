import * as table from '@/blocks/Table/itens'
import * as icons from '@/common/Icons'
import { showError } from 'utils/showError'
import { useRouter } from 'next/router'
import axios from 'axios'
import { GraphQLTypes } from 'graphql/generated/zeus'

export default function RowActions({
  item
}: {
  item: GraphQLTypes['comercial_ContratosBase_Versoes']
}) {
  const router = useRouter()
  const actions = [
    {
      title: 'Visualizar',
      handler: async () => {
        event?.preventDefault()
        await axios
          .get<any>('/api/upload/contrato-presigned', {
            params: {
              id: router.query.id,
              documentName: 'CONTRATO',
              version: item.Versao
            }
          })
          .then((response) => {
            window.open(response.data.url, '_ blank')
          })
          .catch((error) => showError(error))
      },
      icon: <icons.ViewIcon />
    }
  ]
  return <table.ActionsRow actions={actions} data-testid="acoesPorRegistro" />
}
