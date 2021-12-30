import * as blocks from '@/blocks'

import { List as ServicesList } from './Services'
import { List as ProductsList } from './Products'
import { List as UpSellingList } from './UpSelling'
import { List as AtributesList } from './Attributes'
import { List as TariffsList } from './Tariffs'

const sections = {
  ['Produtos relacionados']: <ProductsList />,
  ['Serviços relacionados']: <ServicesList />,
  Oportunidades: <UpSellingList />,
  Atributos: <AtributesList />,
  Tarifas: <TariffsList />
}

export default function Tabs() {
  return <blocks.Tabs categories={sections} />
}
