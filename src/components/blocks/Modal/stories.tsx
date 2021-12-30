import { Story, Meta } from '@storybook/react'
import Modal from '.'

export default {
  title: 'Blocos/Modal',
  component: Modal
} as Meta

export const Default: Story = () => (
  <Modal titulo="" estaAberto={false} handler={() => null} />
)
