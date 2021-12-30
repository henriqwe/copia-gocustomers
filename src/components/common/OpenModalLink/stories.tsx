import { Story, Meta } from '@storybook/react'
import LinkCadastro from '.'

export default {
  title: 'LinkCadastro',
  component: LinkCadastro
} as Meta

export const Default: Story = () => (
  <LinkCadastro onClick={() => null}>a</LinkCadastro>
)
