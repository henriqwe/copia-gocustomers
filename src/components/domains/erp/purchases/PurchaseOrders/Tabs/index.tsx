import * as blocks from '@/blocks'
import * as orcamentos from './Budgets'
import ListarLogs from './LogsList'

const sections = {
  Orçamentos: <orcamentos.List />,
  Logs: <ListarLogs />
}

export default function Tabs() {
  return <blocks.Tabs categories={sections} />
}
