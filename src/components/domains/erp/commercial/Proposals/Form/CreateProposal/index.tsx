import { useState } from 'react'
import { useRouter } from 'next/router'
import { notification } from 'utils/notification'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { showError } from 'utils/showError'

import rotas from '@/domains/routes'

import * as common from '@/common'
import * as form from '@/common/Form'
import * as blocks from '@/blocks'
import * as proposals from '@/domains/erp/commercial/Proposals'
import * as tickets from '@/domains/erp/services/Tickets'

type CreateProposalProps = {
  Ticket: {
    Id: string
    CodigoReferencia: number
  } | null
}

const CreateProposal = ({ Ticket }: CreateProposalProps) => {
  const [vehiclesGroup, setVehiclesGroup] = useState([
    {
      Id: null,
      content: { title: 'Veículo ', subtitle: 'Sem vínculo' },
      position: 1
    }
  ])
  const [vehicleSelected, setVehicleSelected] = useState({
    Id: null,
    content: { title: 'Veículo ', subtitle: 'Sem vínculo' },
    position: 1
  })
  const router = useRouter()
  const {
    createProposal,
    proposalSchema,
    paymentTypesData,
    recurrenceTypesData
  } = proposals.useCreate()
  const { ticketsData } = tickets.useTicket()

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    resolver: yupResolver(proposalSchema)
  })

  async function onSubmit(data: any) {
    try {
      await createProposal({
        variables: {
          Lead_Id: data.Ticket_Id.key.Lead?.Id || null,
          Cliente_Id: data.Ticket_Id.key.Cliente?.Id || null,
          Ticket_Id: data.Ticket_Id.key.Id,
          TipoDePagamento_Id: paymentTypesData?.[0].Valor,
          TipoDeRecorrencia_Id: recurrenceTypesData?.[0].Valor,
          Usuario_Id: data.Ticket_Id.key.Usuario.Id,
          planosData: data.Veiculo1.planos,
          produtosData: data.Veiculo1.produtos,
          servicosData: data.Veiculo1.servicos,
          combosData: data.Veiculo1.combos,
          oportunidadesData: data.Veiculo1.oportunidades
        }
      }).then((value) => {
        router.push(
          rotas.erp.comercial.propostas.index +
            '/' +
            value?.data.insert_comercial_Propostas_one.Id
        )
        notification('Proposta criada com sucesso', 'success')
      })
    } catch (err: any) {
      showError(err)
    }
  }

  return (
    <main className="col-span-12">
      <form>
        <common.Card>
          <common.GenericTitle
            title="Dados da Proposta"
            subtitle="Ticket, cliente ou lead"
            className="px-6"
          />

          <common.Separator />
          <form.FormLine grid={3} position={1}>
            <Controller
              control={control}
              name={'Ticket_Id'}
              defaultValue={
                Ticket
                  ? {
                      key: Ticket,
                      title: 'Código do ticket: ' + Ticket.CodigoReferencia
                    }
                  : undefined
              }
              render={({ field: { onChange, value } }) => (
                <div>
                  <form.Select
                    itens={
                      ticketsData
                        ? ticketsData
                            .filter(
                              (ticket) =>
                                ticket.Usuario.Colaborador !== null &&
                                ticket.Propostas.length === 0
                            )
                            .map((ticket) => {
                              return {
                                key: ticket,
                                title:
                                  'Código do ticket: ' + ticket.CodigoReferencia
                              }
                            })
                        : []
                    }
                    value={value}
                    onChange={onChange}
                    error={errors.Ticket_Id}
                    label="Ticket"
                    disabled={Ticket !== null}
                  />
                </div>
              )}
            />

            {watch('Ticket_Id') ? (
              watch('Ticket_Id').key.Lead ? (
                <common.TitleWithSubTitleAtTheTop
                  title={watch('Ticket_Id').key.Lead?.Nome}
                  subtitle="Lead"
                />
              ) : (
                <common.TitleWithSubTitleAtTheTop
                  title={watch('Ticket_Id').key.Cliente?.Pessoa.Nome}
                  subtitle="Cliente"
                />
              )
            ) : null}
          </form.FormLine>
        </common.Card>

        <div className="grid grid-cols-6 mt-4">
          <blocks.SideBarTabs
            array={vehiclesGroup}
            setArray={setVehiclesGroup}
            onChange={setVehicleSelected}
          />

          {vehiclesGroup.map((vehicleGroup, index) => {
            if (vehicleSelected?.position === vehicleGroup.position) {
              return (
                <Controller
                  control={control}
                  key={index}
                  name={'Veiculo' + vehicleGroup.position}
                  render={({ field: { onChange } }) => (
                    <div className="col-span-5">
                      <proposals.CreateVehicle
                        onChange={onChange}
                        parentSubmit={handleSubmit(onSubmit)}
                        vehicleName={'Veiculo ' + vehicleGroup.position}
                      />
                    </div>
                  )}
                />
              )
            }
          })}
        </div>
      </form>
    </main>
  )
}

export default CreateProposal
