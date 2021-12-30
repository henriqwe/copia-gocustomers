import * as blocks from '@/blocks'

import { List as ServicesList } from './Services'
import { List as ProductsList } from './Products'
import { List as UpSellingList } from './UpSelling'
import { List as AttributesList } from './Attributes'

const sections = {
  ['Produtos relacionados']: <ProductsList />,
  ['Serviços relacionados']: <ServicesList />,
  Oportunidades: <UpSellingList />,
  Atributos: <AttributesList />
}

export default function Tabs() {
  return <blocks.Tabs categories={sections} />
}
