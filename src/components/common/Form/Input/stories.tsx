import { Story, Meta } from '@storybook/react'
import Input from '.'

export default {
  title: 'Comuns/Input',
  component: Input
} as Meta

export const Default: Story = () => (
  <div style={{ backgroundColor: '#F1F5F8' }} className="p-8">
    {/* <Input titulo="Label para campo input" nomeDoCampo="" register={null} /> */}
  </div>
)
