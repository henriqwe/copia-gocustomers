import { Story, Meta } from '@storybook/react'
import DeleteButton from '.'

export default {
  title: 'DeleteButton',
  component: DeleteButton
} as Meta

export const Default: Story = () => <DeleteButton onClick={() => null} />
