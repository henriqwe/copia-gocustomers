import { Story, Meta } from '@storybook/react'
import Logo from '.'

export default {
  title: 'Comuns/Logo',
  component: Logo
} as Meta

export const Default: Story = () => (
  <div style={{ backgroundColor: '#F1F5F8' }} className="p-8">
    <Logo urlDaImagem="" />
  </div>
)
