import * as blocks from '@/blocks'

import { List as ProductsList } from './Combos'

const sections = {
  'Combos dependentes': <ProductsList />
}

export default function Tabs() {
  return <blocks.Tabs categories={sections} />
}
