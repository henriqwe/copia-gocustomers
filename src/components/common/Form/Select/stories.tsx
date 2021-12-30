import { Story, Meta } from '@storybook/react'
import Select from '.'

export default {
  title: 'Select',
  component: Select
} as Meta

export const Default: Story = () => (
  <Select
    items={[]}
    onChange={() => undefined}
    value={{ key: '', titulo: '' }}
  />
)
