import { Story, Meta } from '@storybook/react'
import MenuPrincipal from '.'

export default {
  title: 'Comuns/MenuPrincipal',
  component: MenuPrincipal
} as Meta

export const Default: Story = () => (
  <div style={{ backgroundColor: '#F1F5F8' }} className="p-8">
    <MenuPrincipal grupoDeLinks={[]} />
  </div>
)
