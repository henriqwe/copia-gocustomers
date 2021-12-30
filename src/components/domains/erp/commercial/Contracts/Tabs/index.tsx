import * as blocks from '@/blocks'

import { List } from './Versions'

const sections = {
  Versões: <List />
}

export default function Tabs() {
  return <blocks.Tabs categories={sections} />
}
