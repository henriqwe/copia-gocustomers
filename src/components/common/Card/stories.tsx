import { Story, Meta } from '@storybook/react'
import Cartao from '.'

export default {
  title: 'Cartao',
  component: Cartao
} as Meta

export const Default: Story = () => <Cartao>p</Cartao>
