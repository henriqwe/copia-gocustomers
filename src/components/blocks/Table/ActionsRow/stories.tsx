import { Story, Meta } from '@storybook/react'
import CampoDaColunaComAcao from '.'

export default {
  title: 'Blocos/Tabela/Colunas/CampoDaColunaComAcao',
  component: CampoDaColunaComAcao
} as Meta

export const Default: Story = () => <CampoDaColunaComAcao acoes={[]} />
