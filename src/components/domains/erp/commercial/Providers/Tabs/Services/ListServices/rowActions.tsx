import { GraphQLTypes } from 'graphql/generated/zeus'
import * as table from '@/blocks/Table/itens'
import * as form from '@/common/Form'
import * as icons from '@/common/Icons'
import * as services from '@/domains/erp/commercial/Providers/Tabs/Services'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function RowActions({
  item
}: {
  item: GraphQLTypes['comercial_Servicos']
}) {
  const router = useRouter()
  const provider = item.Fornecedores.filter(
    (provider) =>
      provider.Servico_Id === item.Id &&
      router.query.id === provider.Fornecedor_Id
  )
  const [active, setActive] = useState(
    provider.length > 0 && provider[0].deleted_at === null
  )
  const {
    activeService,
    removeService,
    servicesRefetch,
    setSlidePanelState,
    reactivateService
  } = services.useService()
  const actions = [
    {
      title: 'Ativar',
      handler: async () => {
        event?.preventDefault()
      },
      icon: (
        <>
          <form.Switch
            onChange={async () => {
              if (active) {
                await removeService({
                  variables: {
                    Id: item.Fornecedores[0].Id
                  }
                }).then(() => {
                  setActive(false)
                  servicesRefetch()
                })
                return
              }

              if (provider.length > 0) {
                if (provider[0].deleted_at === null) {
                  await activeService({
                    variables: {
                      Servico_Id: item.Id
                    }
                  }).then(() => {
                    setActive(true)
                    servicesRefetch()
                  })
                  return
                }

                await reactivateService({
                  variables: {
                    Id: item.Fornecedores[0].Id
                  }
                }).then(() => {
                  setActive(true)
                  servicesRefetch()
                })
                return
              }

              await activeService({
                variables: {
                  Servico_Id: item.Id
                }
              }).then(() => {
                setActive(true)
                servicesRefetch()
              })
            }}
            value={active}
            size="small"
          />
        </>
      )
    }
  ]

  if (active) {
    actions.push(
      {
        title: 'Editar',
        handler: async () => {
          event?.preventDefault()
          setSlidePanelState({
            open: true,
            data: item,
            type: 'tariff'
          })
        },
        icon: <icons.BurguerIcon />
      },
      {
        title: 'Precificar',
        handler: async () => {
          event?.preventDefault()
          setSlidePanelState({
            open: true,
            data: item,
            type: 'pricing'
          })
        },
        icon: <icons.DollarIcon />
      }
    )
  }

  return <table.ActionsRow actions={actions} data-testid="acoesPorRegistro" />
}
