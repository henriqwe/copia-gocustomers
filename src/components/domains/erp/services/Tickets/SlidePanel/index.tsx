import * as blocks from '@/blocks'
import * as tickets from '@/domains/erp/services/Tickets'

type SlidePanelProps = {
  Flow?: { key: string; title: string }
  FlowStage?: { key: string; title: string }
  TicketType?: { key: string; title: string }
  TicketId?: string
}

export default function SlidePanel({
  Flow,
  FlowStage,
  TicketType,
  TicketId
}: SlidePanelProps) {
  const { slidePanelState, setSlidePanelState } = tickets.useTicket()
  let title = 'Cadastrar Ticket'
  let Component = (
    <tickets.Create
      defaultFlowValue={Flow}
      defaultFlowStageValue={FlowStage}
      defaultTicketTypeValue={TicketType}
    />
  )

  switch (slidePanelState.type) {
    case 'update':
      Component = <tickets.Update />
      title = 'Editar Ticket'
      break
    case 'view':
      Component = <tickets.View Id={TicketId} />
      title = 'Detalhe do Ticket'
      break
  }
  return (
    <blocks.Modal
      title={title}
      open={slidePanelState.open}
      handler={setSlidePanelState}
      formContent={Component}
    />
  )
}
