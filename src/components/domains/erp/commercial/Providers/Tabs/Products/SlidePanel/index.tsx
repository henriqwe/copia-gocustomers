import * as blocks from '@/blocks'
import * as products from '@/domains/erp/commercial/Providers/Tabs/Products'

export default function SlidePanel() {
  const { slidePanelState, setSlidePanelState } = products.useProduct()
  return (
    <blocks.Modal
      title={'Precificar produto'}
      open={slidePanelState.open}
      handler={setSlidePanelState}
      formContent={<products.Price />}
    />
  )
}
