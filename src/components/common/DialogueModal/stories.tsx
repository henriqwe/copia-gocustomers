import { Story, Meta } from '@storybook/react'
import DialogoModal from '.'

export default {
  title: 'DialogoModal',
  component: DialogoModal
} as Meta

export const Default: Story = () => (
  <DialogoModal isOpen={false} setModal={() => null} />
)
