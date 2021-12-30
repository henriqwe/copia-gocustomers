import { Story, Meta } from '@storybook/react'
import ListaDeDados from '.'

export default {
  title: 'Blocos/ListaDeDados',
  component: ListaDeDados
} as Meta

export const Default: Story = () => <ListaDeDados dados={[]} />
