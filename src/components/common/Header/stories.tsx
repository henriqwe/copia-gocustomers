import { Story, Meta } from '@storybook/react'
import Cabecalho from '.'

export default {
  title: 'Comuns/Cabecalho',
  component: Cabecalho
} as Meta

export const Default: Story = () => (
  <div style={{ backgroundColor: '#F1F5F8' }} className="p-8">
    <Cabecalho />
  </div>
)
