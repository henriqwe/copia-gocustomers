import { Story, Meta } from '@storybook/react'
import LogoComLink from '.'

export default {
  title: 'Comuns/LogoComLink',
  component: LogoComLink
} as Meta

export const Default: Story = () => (
  <div style={{ backgroundColor: '#F1F5F8' }} className="p-8">
    <LogoComLink url="" urlDaImagem="" />
  </div>
)
