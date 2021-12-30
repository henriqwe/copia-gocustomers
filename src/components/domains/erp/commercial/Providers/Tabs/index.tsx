import * as blocks from '@/blocks'

import { List as ServicesList } from './Services'
import { List as ProductsList } from './Products'

const sections = {
  Produtos: <ProductsList />,
  Serviços: <ServicesList />
}

export default function Tabs() {
  return <blocks.Tabs categories={sections} />
}
