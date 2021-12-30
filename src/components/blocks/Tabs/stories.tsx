import { Story, Meta } from '@storybook/react'
import Guias from '.'

export default {
  title: 'Blocos/Guias',
  component: Guias
} as Meta

export const Default: Story = () => <Guias categorias={[]} />
