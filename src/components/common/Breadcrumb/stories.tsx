import { Story, Meta } from '@storybook/react'
import Breadcrumb from '.'

export default {
  title: 'Comuns/Breadcrumb',
  component: Breadcrumb
} as Meta

export const Default: Story = () => (
  <div style={{ backgroundColor: '#F1F5F8' }} className="p-8">
    <Breadcrumb
      titulo=""
      recarregar={{ estado: true, acao: () => null }}
      localizacaoAtual={[]}
      setTrocarAberto={() => null}
      setMostrarModal={() => null}
    />
  </div>
)
