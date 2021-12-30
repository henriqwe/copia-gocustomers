import { Story, Meta } from '@storybook/react'
import * as common from '@/common'

export default {
  title: 'InputDeIdentificacao',
  component: common.InputDeCPF
} as Meta

export const Default: Story = () => <common.InputDeCPF register={() => null} />
