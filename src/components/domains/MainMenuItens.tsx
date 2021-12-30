import { ChipIcon, DeviceMobileIcon, HomeIcon } from '@heroicons/react/outline'
import React from 'react'
import rotas from './routes'

export default {
  erp: [
    {
      title: 'Início',
      icon: <HomeIcon className="w-4 h-4 mx-4" />,
      url: rotas.erp.home,
      children: []
    },
    {
      title: 'Atendimento',
      url: rotas.erp.atendimento.index,
      icon: <DeviceMobileIcon className="w-4 h-4 mx-4" />,
      children: [
        {
          title: 'Cadastros',
          url: rotas.erp.atendimento.cadastros.index,
          children: [
            {
              title: 'Fluxos',
              url: rotas.erp.atendimento.cadastros.fluxos.index,
              icon: <ChipIcon className="w-4 h-4 mx-4" />
            },
            {
              title: 'Perguntas',
              url: rotas.erp.atendimento.cadastros.perguntas.index,
              icon: <ChipIcon className="w-4 h-4 mx-4" />
            },
            {
              title: 'Ações',
              url: rotas.erp.atendimento.cadastros.acoes,
              icon: <ChipIcon className="w-4 h-4 mx-4" />
            }
          ],
          icon: <ChipIcon className="w-4 h-4 mx-4" />
        },
        {
          title: 'Leads',
          url: rotas.erp.atendimento.leads,
          icon: <ChipIcon className="w-4 h-4 mx-4" />
        },
        {
          title: 'Tickets',
          url: rotas.erp.atendimento.tickets,
          icon: <ChipIcon className="w-4 h-4 mx-4" />
        },
        {
          title: 'Perfis Comerciais',
          url: rotas.erp.atendimento.perfisComerciais.index,
          icon: <ChipIcon className="w-4 h-4 mx-4" />
        },
        {
          title: 'Veículos',
          url: rotas.erp.atendimento.vehicles,
          icon: <ChipIcon className="w-4 h-4 mx-4" />
        }
      ]
    },
    {
      title: 'Pedidos de Saída',
      icon: <HomeIcon className="w-4 h-4 mx-4" />,
      url: rotas.erp.pedidosDeSaida.index,
      children: []
    },
    {
      title: 'Identidades',
      url: rotas.erp.identidades.index,
      children: [
        {
          title: 'Clientes',
          url: rotas.erp.identidades.clientes.index,
          icon: <ChipIcon className="w-4 h-4 mx-4" />
        },
        {
          title: 'Colaboradores',
          url: rotas.erp.identidades.colaboradores,
          icon: <ChipIcon className="w-4 h-4 mx-4" />
        },
        {
          title: 'Fornecedores',
          url: rotas.erp.identidades.fornecedores.index,
          icon: <ChipIcon className="w-4 h-4 mx-4" />
        },
        {
          title: 'Usuários',
          url: rotas.erp.identidades.usuarios,
          icon: <ChipIcon className="w-4 h-4 mx-4" />
        }
      ],
      icon: <HomeIcon className="w-4 h-4 mx-4" />
    },
    {
      title: 'Comercial',
      url: rotas.erp.comercial.index,
      children: [
        {
          title: 'Cadastros',
          url: rotas.erp.comercial.cadastros.index,
          children: [
            {
              title: 'Condicionais',
              url: rotas.erp.comercial.cadastros.condicionais,
              icon: <ChipIcon className="w-4 h-4 mx-4" />
            },
            {
              title: 'Coberturas',
              url: rotas.erp.comercial.cadastros.coberturas,
              icon: <ChipIcon className="w-4 h-4 mx-4" />
            },
            {
              title: 'Atributos',
              url: rotas.erp.comercial.cadastros.atributos,
              icon: <ChipIcon className="w-4 h-4 mx-4" />
            },
            {
              title: 'Tarifas',
              url: rotas.erp.comercial.cadastros.tarifas,
              icon: <ChipIcon className="w-4 h-4 mx-4" />
            }
          ],
          icon: <ChipIcon className="w-4 h-4 mx-4" />
        },
        {
          title: 'Parceiros',
          url: rotas.erp.comercial.fornecedores,
          icon: <ChipIcon className="w-4 h-4 mx-4" />
        },
        {
          title: 'Produtos',
          url: rotas.erp.comercial.produtos,
          icon: <ChipIcon className="w-4 h-4 mx-4" />
        },
        {
          title: 'Serviços',
          url: rotas.erp.comercial.servicos,
          icon: <ChipIcon className="w-4 h-4 mx-4" />
        },
        {
          title: 'Planos',
          url: rotas.erp.comercial.planos.index,
          icon: <ChipIcon className="w-4 h-4 mx-4" />
        },
        {
          title: 'Combos',
          url: rotas.erp.comercial.combos.index,
          icon: <ChipIcon className="w-4 h-4 mx-4" />
        },
        {
          title: 'Propostas',
          url: rotas.erp.comercial.propostas.index,
          icon: <ChipIcon className="w-4 h-4 mx-4" />
        },
        {
          title: 'Contratos',
          url: rotas.erp.comercial.contratos,
          icon: <ChipIcon className="w-4 h-4 mx-4" />
        }
      ],
      icon: <HomeIcon className="w-4 h-4 mx-4" />
    },
    {
      title: 'Operacional',
      url: rotas.erp.operacional.index,
      children: [
        {
          title: 'Ordens de serviços',
          url: rotas.erp.operacional.ordensDeServico,
          icon: <ChipIcon className="w-4 h-4 mx-4" />
        }
      ],
      icon: <HomeIcon className="w-4 h-4 mx-4" />
    },
    {
      title: 'Estoque',
      url: rotas.erp.estoque.index,
      children: [
        {
          title: 'Cadastros',
          url: rotas.erp.estoque.cadastros.index,
          icon: <ChipIcon className="w-4 h-4 mx-4" />,
          children: [
            {
              title: 'Grupos',
              url: rotas.erp.estoque.cadastros.grupos,
              icon: <ChipIcon className="w-4 h-4 mx-4" />
            },
            {
              title: 'Famílias',
              url: rotas.erp.estoque.cadastros.familias,
              icon: <ChipIcon className="w-4 h-4 mx-4" />
            },
            {
              title: 'Fabricantes',
              url: rotas.erp.estoque.cadastros.fabricantes,
              icon: <ChipIcon className="w-4 h-4 mx-4" />
            },
            {
              title: 'Endereçamentos',
              url: rotas.erp.estoque.cadastros.enderecamentos.index,
              icon: <ChipIcon className="w-4 h-4 mx-4" />
            },
            {
              title: 'Modelos',
              url: rotas.erp.estoque.cadastros.modelos,
              icon: <ChipIcon className="w-4 h-4 mx-4" />
            }
          ]
        },
        {
          title: 'Itens',
          url: rotas.erp.estoque.itens.index,
          icon: <DeviceMobileIcon className="w-4 h-4 mx-4" />
        },
        {
          title: 'Movimentações',
          url: rotas.erp.estoque.movimentacoes.index,
          icon: <ChipIcon className="w-4 h-4 mx-4" />
        }
      ],
      icon: <HomeIcon className="w-4 h-4 mx-4" />
    },
    {
      title: 'Produção',
      url: rotas.erp.producao.index,
      icon: <DeviceMobileIcon className="w-4 h-4 mx-4" />,
      children: [
        {
          title: 'Identificáveis',
          url: rotas.erp.producao.identificaveis.index,
          children: [
            {
              title: 'Chips',
              url: rotas.erp.producao.identificaveis.chips.index,
              icon: <ChipIcon className="w-4 h-4 mx-4" />
            },
            {
              title: 'Identificadores',
              url: rotas.erp.producao.identificaveis.identificadores.index,
              icon: <ChipIcon className="w-4 h-4 mx-4" />
            },
            {
              title: 'Equipamentos',
              url: rotas.erp.producao.identificaveis.equipamentos.index,
              icon: <ChipIcon className="w-4 h-4 mx-4" />
            }
          ],
          icon: <ChipIcon className="w-4 h-4 mx-4" />
        },
        {
          title: 'Kits',
          url: rotas.erp.producao.kits.index,
          children: [
            {
              title: 'Kits de insumo',
              url: rotas.erp.producao.kits.kitsDeInsumo.index,
              icon: <ChipIcon className="w-4 h-4 mx-4" />
            },
            {
              title: 'Kits de instalação',
              url: rotas.erp.producao.kits.kitsDeInstalacao.index,
              icon: <ChipIcon className="w-4 h-4 mx-4" />
            }
          ],
          icon: <ChipIcon className="w-4 h-4 mx-4" />
        },
        {
          title: 'Rastreadores',
          url: rotas.erp.producao.rastreadores.index,
          icon: <ChipIcon className="w-4 h-4 mx-4" />
        }
      ]
    },
    {
      title: 'Compras',
      url: rotas.erp.compras.index,
      children: [
        {
          title: 'Produtos',
          url: rotas.erp.compras.produtos.index,
          icon: <ChipIcon className="w-4 h-4 mx-4" />
        },
        {
          title: 'Pedidos',
          url: rotas.erp.compras.pedidos.index,
          icon: <ChipIcon className="w-4 h-4 mx-4" />
        }
      ],
      icon: <HomeIcon className="w-4 h-4 mx-4" />
    },
    {
      title: 'Configurações',
      icon: <HomeIcon className="w-4 h-4 mx-4" />,
      url: rotas.erp.configuracoes.index,
      children: []
    },
    {
      title: 'Kanban',
      url: rotas.erp.kanban,
      icon: <ChipIcon className="w-4 h-4 mx-4" />
    },
    {
      title: 'Mapa',
      url: rotas.erp.mapa,
      icon: <ChipIcon className="w-4 h-4 mx-4" />
    },
    {
      title: 'Calendário',
      url: rotas.erp.calendario,
      icon: <ChipIcon className="w-4 h-4 mx-4" />
    }
  ],
  rastreamento: [
    {
      title: 'Início',
      icon: <HomeIcon className="w-4 h-4 mx-4" />,
      url: rotas.erp.home,
      children: []
    }
  ],
  assistencia: [
    {
      title: 'Início',
      icon: <HomeIcon className="w-4 h-4 mx-4" />,
      url: rotas.assistencia.home,
      children: []
    }
  ]
}
