import { Controller, useForm } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as flows from '@/domains/erp/services/Registration/Flows'
import * as tickets from '@/domains/erp/services/Tickets'
import * as leads from '@/domains/erp/services/Leads'
import * as clients from '@/domains/erp/identities/Clients'

import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'
import router from 'next/router'
import rotas from '@/domains/routes'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

type FormData = {
  Id: string
  Tipo_Id: SelectItem
  Etapa_Id: SelectItem
  Fluxo_Id: SelectItem
  Usuario_Id: SelectItem
  Lead_Id: SelectItem
  Cliente_Id: SelectItem
}

type SelectItem = {
  key: string
  title: string
}

type CreateTicketProps = {
  defaultFlowValue?: { key: string; title: string }
  defaultFlowStageValue?: { key: string; title: string }
  defaultTicketTypeValue?: { key: string; title: string }
}

export default function CreateTicket({
  defaultFlowValue,
  defaultFlowStageValue,
  defaultTicketTypeValue
}: CreateTicketProps) {
  const [personCategory, setPersonCategory] = useState<'lead' | 'cliente'>(
    'lead'
  )
  const [flowStages, setFlowStages] = useState<{ Id: string; Nome: string }[]>(
    []
  )
  const {
    createTicketLoading,
    createTicket,
    setSlidePanelState,
    ticketsTypeData,
    ticketsRefetch,
    ticketSchema,
    getFlowStageByFlow_Id,
    usersData
  } = tickets.useTicket()
  const { flowsData } = flows.useFlow()
  const { leadsData } = leads.useLead()
  const { clientsData } = clients.useList()
  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset,
    setValue
  } = useForm({
    resolver: yupResolver(ticketSchema(personCategory))
  })

  const onSubmit = (formData: FormData) => {
    createTicket({
      variables: {
        Fluxo_Id: formData.Fluxo_Id.key,
        Tipo_Id: formData.Tipo_Id.key,
        Etapa_Id: formData.Etapa_Id.key,
        Usuario_Id: formData.Usuario_Id.key,
        Lead_Id: personCategory === 'lead' ? formData.Lead_Id.key : null,
        Cliente_Id:
          personCategory === 'cliente' ? formData.Cliente_Id.key : null
      }
    })
      .then(() => {
        ticketsRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false }
        })
        notification('Ticket cadastrado com sucesso', 'success')
      })
      .catch((err) => {
        showError(err)
      })
  }

  useEffect(() => {
    if (watch('Fluxo_Id') !== undefined) {
      getFlowStageByFlow_Id(watch('Fluxo_Id').key).then((flowStagesData) => {
        setFlowStages(flowStagesData)
      })
    }
  }, [watch('Fluxo_Id')])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      data-testid="inserirForm"
      className="flex flex-col items-end"
    >
      <div className="flex flex-col w-full gap-2 mb-2">
        <Controller
          control={control}
          defaultValue={defaultFlowValue}
          name="Fluxo_Id"
          render={({ field: { onChange, value } }) => (
            <div>
              <form.Select
                itens={
                  flowsData
                    ? flowsData.map((item) => {
                        return {
                          key: item.Id,
                          title: item.Nome
                        }
                      })
                    : []
                }
                value={value}
                onChange={(e) => {
                  if (watch('Fluxo_Id') !== undefined) {
                    setValue('Etapa_Id', undefined)
                    reset({
                      Etapa_Id: {
                        key: '',
                        title: ''
                      },
                      Tipo_Id: {
                        key: watch('Tipo_Id').key || '',
                        title: watch('Tipo_Id').title || ''
                      },
                      Fluxo_Id: {
                        key: watch('Fluxo_Id').key || '',
                        title: watch('Fluxo_Id').title || ''
                      }
                    })
                  }

                  onChange(e)
                }}
                error={errors.Fluxo_Id}
                label="Fluxo"
                disabled={defaultFlowValue !== undefined}
              />
              <common.OpenModalLink
                onClick={() =>
                  router.push(rotas.erp.atendimento.cadastros.fluxos.index)
                }
              >
                Cadastrar Fluxo
              </common.OpenModalLink>
            </div>
          )}
        />
        <Controller
          control={control}
          defaultValue={defaultFlowStageValue}
          name="Etapa_Id"
          render={({ field: { onChange, value } }) => (
            <div>
              <form.Select
                itens={
                  flowStages
                    ? flowStages.map((item) => {
                        return {
                          key: item.Id,
                          title: item.Nome
                        }
                      })
                    : []
                }
                value={value}
                onChange={onChange}
                error={errors.Etapa_Id}
                label="Etapa"
                disabled={
                  watch('Fluxo_Id') === undefined ||
                  defaultFlowStageValue !== undefined
                }
              />
              <common.OpenModalLink
                onClick={() =>
                  router.push(rotas.erp.atendimento.cadastros.fluxos.etapas)
                }
              >
                Cadastrar Etapa de fluxo
              </common.OpenModalLink>
            </div>
          )}
        />
        <Controller
          control={control}
          name="Tipo_Id"
          defaultValue={defaultTicketTypeValue}
          render={({ field: { onChange, value } }) => (
            <div>
              <form.Select
                itens={
                  ticketsTypeData
                    ? ticketsTypeData.map((item) => {
                        return {
                          key: item.Valor,
                          title: item.Comentario
                        }
                      })
                    : []
                }
                value={value}
                onChange={onChange}
                error={errors.Tipo_Id}
                label="Tipo"
                disabled={defaultTicketTypeValue !== undefined}
              />
            </div>
          )}
        />

        <Controller
          control={control}
          name="Usuario_Id"
          render={({ field: { onChange, value } }) => (
            <div>
              <form.Select
                itens={
                  usersData
                    ? usersData.map((item) => {
                        return {
                          key: item.Id,
                          title: item.Colaborador?.Pessoa.Nome as string
                        }
                      })
                    : []
                }
                value={value}
                onChange={onChange}
                error={errors.Usuario_Id}
                label="Usuário"
              />
            </div>
          )}
        />
        <common.Separator />
        <common.ListRadioGroup
          options={[
            {
              value: 'lead',
              content: (
                <div className="inline-flex items-center gap-4">
                  <p className="text-sm">Lead</p>
                </div>
              )
            },
            {
              value: 'cliente',
              content: (
                <div className="inline-flex items-center gap-4">
                  <p className="text-sm">Cliente</p>
                </div>
              )
            }
          ]}
          horizontal
          selectedValue={{
            value: 'lead',
            content: (
              <div className="inline-flex items-center gap-4">
                <p className="text-sm">Lead</p>
              </div>
            )
          }}
          setSelectedOption={
            setPersonCategory as Dispatch<SetStateAction<string>>
          }
        />

        {personCategory === 'lead' && (
          <Controller
            control={control}
            name="Lead_Id"
            render={({ field: { onChange, value } }) => (
              <div>
                <form.Select
                  itens={
                    leadsData
                      ? leadsData
                          .filter((lead) => lead.Tickets.length === 0)
                          .map((item) => {
                            return {
                              key: item.Id,
                              title: item.Nome
                            }
                          })
                      : []
                  }
                  value={value}
                  onChange={(e) => {
                    setValue('Cliente_Id', undefined)
                    onChange(e)
                  }}
                  error={errors.Lead_Id}
                  label="Lead"
                />
              </div>
            )}
          />
        )}

        {personCategory === 'cliente' && (
          <Controller
            control={control}
            name="Cliente_Id"
            render={({ field: { onChange, value } }) => (
              <div>
                <form.Select
                  itens={
                    clientsData
                      ? clientsData
                          .filter((clients) => clients.Tickets.length === 0)
                          .map((item) => {
                            return {
                              key: item.Id,
                              title: item.Pessoa?.Nome as string
                            }
                          })
                      : []
                  }
                  value={value}
                  onChange={(e) => {
                    setValue('Lead_Id', undefined)
                    onChange(e)
                  }}
                  error={errors.Cliente_Id}
                  label="Cliente"
                />
              </div>
            )}
          />
        )}
      </div>
      <common.Separator />
      <buttons.PrimaryButton
        title="Enviar"
        disabled={createTicketLoading}
        loading={createTicketLoading}
      />
    </form>
  )
}
