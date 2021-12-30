import { Story, Meta } from '@storybook/react'
import InputDeTelefone from '.'

export default {
  title: 'InputDeTelefone',
  component: InputDeTelefone
} as Meta

export const Default: Story = () => (
  <InputDeTelefone register={() => null} control={{}} />
)
