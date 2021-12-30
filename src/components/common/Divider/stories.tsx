import { Story, Meta } from '@storybook/react'
import Divididor from '.'

export default {
  title: 'Comuns/Divididor',
  component: Divididor
} as Meta

export const Default: Story = () => (
  <div style={{ backgroundColor: '#F1F5F8' }} className="p-8">
    <Divididor />
  </div>
)
