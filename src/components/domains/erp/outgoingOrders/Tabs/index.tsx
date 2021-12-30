import * as blocks from '@/blocks'
import ListarLogs from './LogsList'

const sections = {
  Logs: <ListarLogs />
}

export default function Tabs() {
  return <blocks.Tabs categories={sections} />
}
