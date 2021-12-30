import { Story, Meta } from '@storybook/react'
import MenuUsuario from '.'

export default {
  title: 'Blocos/MenuUsuario',
  component: MenuUsuario
} as Meta

export const Default: Story = () => (
  <MenuUsuario setTrocarAberto={() => null} setMostrarModal={() => null} />
)
