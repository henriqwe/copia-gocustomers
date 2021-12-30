import * as blocks from '@/blocks'
import * as addresses from './Addresses'
import * as sellers from './Sellers'
import * as services from './Services'
import * as providers from '../'

const sections = {
  Endereços: <addresses.List />,
  Vendedores: <sellers.List />
}

const sectionsService = {
  ...sections,
  Serviços: <services.List />
}

export default function Tabs() {
  const { providerData } = providers.useUpdate()

  return (
    <blocks.Tabs
      categories={providerData?.PrestadorDeServico ? sectionsService : sections}
    />
  )
}
