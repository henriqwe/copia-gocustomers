import * as common from '@/common'
import * as form from '@/common/Form'
import * as buttons from '@/common/Buttons'
import * as tickets from '@/domains/erp/services/Tickets'
import { useRouter } from 'next/router'

import { useEffect, useState } from 'react'

type ViewTicketProps = {
  Id?: string
}

type ActionsArray = {
  Id: string
  Titulo: string
  Url: string
}[]

export default function ViewTicket({ Id }: ViewTicketProps) {
  const router = useRouter()
  const [ticket, setTicket] = useState<tickets.Ticket>()
  const [actions, setActions] = useState<ActionsArray>()
  const { getTicketByPk, getActionByFlowStageId } = tickets.useTicket()

  function renderButton(action: any) {
    if (ticket?.Propostas.length && action.Titulo === 'Visualizar Proposta') {
      return (
        <buttons.PrimaryButton
          key={action.Id}
          title={action.Titulo}
          onClick={() => {
            router.push(action.Url + '/' + ticket?.Propostas[0].Id)
          }}
          type="button"
          disabled={false}
        />
      )
    }

    if (
      ticket?.Propostas.length === 0 &&
      action.Titulo === 'Cadastrar Proposta'
    ) {
      return (
        <buttons.PrimaryButton
          key={action.Id}
          title={action.Titulo}
          onClick={() => {
            router.push({
              pathname: action.Url,
              query: {
                Ticket: JSON.stringify(ticket)
              }
            })
          }}
          type="button"
          disabled={false}
        />
      )
    }

    if (
      ticket?.Lead?.PerfisComerciais.length &&
      action.Titulo === 'Visualizar Perfil'
    ) {
      return (
        <buttons.PrimaryButton
          key={action.Id}
          title={action.Titulo}
          onClick={() => {
            router.push(action.Url + '/' + ticket?.Lead?.PerfisComerciais[0].Id)
          }}
          type="button"
          disabled={false}
        />
      )
    }

    if (
      ticket?.Lead?.PerfisComerciais.length === 0 &&
      action.Titulo === 'Cadastrar Perfil'
    ) {
      return (
        <buttons.PrimaryButton
          key={action.Id}
          title={action.Titulo}
          onClick={() => {
            router.push({
              pathname: action.Url,
              query: {
                Lead_Id: ticket?.Lead?.Id,
                Lead_Nome: ticket?.Lead?.Nome
              }
            })
          }}
          type="button"
          disabled={false}
        />
      )
    }

    return <></>
  }

  useEffect(() => {
    if (Id) {
      getTicketByPk(Id as string).then((ticketByPk) => {
        setTicket(ticketByPk)
        getActionByFlowStageId({
          key: ticketByPk?.Etapa.Id as string,
          title: ticketByPk?.Etapa.Nome as string
        }).then((actionsArray) => {
          setActions(actionsArray)
        })
      })
    }
  }, [Id, getTicketByPk])

  return (
    <form data-testid="editForm" className="flex flex-col items-end">
      <div className="flex flex-col w-full gap-2 mb-2">
        <common.TitleWithSubTitleAtTheTop
          title={ticket?.Lead?.Nome as string}
          subtitle="Nome da lead"
        />
        <p>Email: {ticket?.Lead?.Email}</p>
        <p>Telefone: {ticket?.Lead?.Telefone}</p>
        <common.Separator />
        <div className="col-span-2">
          <form.Select
            itens={[]}
            value={{
              key: ticket?.Fluxo.Id as string,
              title: ticket?.Fluxo.Nome as string
            }}
            onChange={() => null}
            disabled
            label="Fluxo"
          />
        </div>

        <div className="col-span-2">
          <form.Select
            itens={[]}
            value={{
              key: ticket?.Etapa.Id as string,
              title: ticket?.Etapa.Nome as string
            }}
            onChange={() => null}
            disabled
            label="Etapa"
          />
        </div>

        <div className="col-span-2">
          <form.Select
            itens={[]}
            value={{
              key: ticket?.Tipo.Valor as string,
              title: ticket?.Tipo.Comentario as string
            }}
            onChange={() => null}
            disabled
            label="Tipo"
          />
        </div>

        <div className="col-span-3">
          <form.Select
            itens={[]}
            value={{
              key: ticket?.Usuario.Id as string,
              title: ticket?.Usuario.Colaborador?.Pessoa.Nome as string
            }}
            onChange={() => null}
            disabled
            label="Usuário"
          />
        </div>
      </div>
      <common.Separator />

      <div className="grid w-full grid-cols-2">
        {actions?.map((action, index) => (
          <div
            key={action.Id}
            className={`${index % 2 === 0 ? '' : 'flex items-end justify-end'}`}
          >
            {renderButton(action)}
          </div>
        ))}
      </div>

      {/* {ticket && ticket?.Propostas.length === 0 && (
        <buttons.SecondaryButton
          handler={() =>
            router.push({
              pathname: rotas.erp.comercial.propostas.cadastrar
            })
          }
          title="Criar proposta"
          type="button"
        />
      )}

      {ticket && ticket?.Propostas.length > 0 && (
        <buttons.PrimaryButton
          title="Visualizar proposta"
          onClick={() =>
            router.push(
              rotas.erp.comercial.propostas.index +
                '/' +
                ticket?.Propostas[0].Id
            )
          }
          type="button"
          disabled={false}
        />
      )} */}
    </form>
  )
}
