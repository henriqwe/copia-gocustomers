import { Story, Meta } from '@storybook/react'
import Dropdown from '.'

export default {
  title: 'Comuns/Dropdown',
  component: Dropdown
} as Meta

export const Default: Story = () => (
  <div style={{ backgroundColor: '#F1F5F8' }} className="p-8">
    <Dropdown />
  </div>
)
