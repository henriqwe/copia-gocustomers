export default {
  erp: {
    home: '/erp',
    atendimento: {
      cadastros: {
        fluxos: {
          index: '/erp/atendimento/cadastros/fluxos',
          etapas: '/erp/atendimento/cadastros/fluxos/etapas'
        },
        perguntas: {
          index: '/erp/atendimento/cadastros/perguntas',
          grupos: {
            index: '/erp/atendimento/cadastros/perguntas/grupos',
            cadastrar: '/erp/atendimento/cadastros/perguntas/grupos/cadastrar'
          }
        },
        acoes: '/erp/atendimento/cadastros/acoes',
        index: '/erp/atendimento/cadastros'
      },
      leads: '/erp/atendimento/leads',
      tickets: '/erp/atendimento/tickets',
      perfisComerciais: {
        cadastrar: '/erp/atendimento/perfis-comerciais/cadastrar',
        index: '/erp/atendimento/perfis-comerciais'
      },
      vehicles: '/erp/atendimento/veiculos',
      index: '/erp/atendimento'
    },
    pedidosDeSaida: {
      index: '/erp/pedidos-de-saida',
      cadastrar: '/erp/pedidos-de-saida/cadastrar'
    },
    identidades: {
      clientes: {
        index: '/erp/identidades/clientes',
        cadastrar: '/erp/identidades/clientes/cadastrar'
      },
      fornecedores: {
        index: '/erp/identidades/fornecedores',
        cadastrar: '/erp/identidades/fornecedores/cadastrar'
      },
      usuarios: '/erp/identidades/usuarios',
      colaboradores: '/erp/identidades/colaboradores',
      index: '/erp/identidades'
    },
    comercial: {
      cadastros: {
        condicionais: '/erp/comercial/cadastros/condicionais',
        coberturas: '/erp/comercial/cadastros/coberturas',
        atributos: '/erp/comercial/cadastros/atributos',
        tarifas: '/erp/comercial/cadastros/tarifas',
        index: '/erp/comercial/cadastros'
      },
      planos: {
        cadastrar: '/erp/comercial/planos/cadastrar',
        index: '/erp/comercial/planos'
      },
      combos: {
        cadastrar: '/erp/comercial/combos/cadastrar',
        index: '/erp/comercial/combos'
      },
      propostas: {
        cadastrar: '/erp/comercial/propostas/cadastrar',
        index: '/erp/comercial/propostas'
      },
      contratos: '/erp/comercial/contratos',
      fornecedores: '/erp/comercial/fornecedores',
      produtos: '/erp/comercial/produtos',
      servicos: '/erp/comercial/servicos',
      index: '/erp/comercial'
    },
    operacional: {
      ordensDeServico: '/erp/operacional/ordens-de-servico',
      index: '/erp/operacional'
    },
    estoque: {
      cadastros: {
        grupos: '/erp/estoque/cadastros/grupos',
        familias: '/erp/estoque/cadastros/familias',
        fabricantes: '/erp/estoque/cadastros/fabricantes',
        enderecamentos: {
          index: '/erp/estoque/cadastros/enderecamentos',
          tipos: '/erp/estoque/cadastros/enderecamentos/tipos'
        },
        modelos: '/erp/estoque/cadastros/modelos',
        index: '/erp/estoque/cadastros'
      },

      itens: {
        index: '/erp/estoque/itens',
        cadastrar: '/erp/estoque/itens/cadastrar'
      },
      movimentacoes: {
        entradas: {
          index: '/erp/estoque/movimentacoes/entradas'
        },
        saidas: {
          index: '/erp/estoque/movimentacoes/saidas'
        },
        index: '/erp/estoque/movimentacoes'
      },
      index: '/erp/estoque'
    },
    producao: {
      identificaveis: {
        chips: {
          index: '/erp/producao/identificaveis/chips',
          cadastrar: '/erp/producao/identificaveis/chips/cadastrar',
          operadoras: '/erp/producao/identificaveis/chips/operadoras'
        },
        identificadores: {
          index: '/erp/producao/identificaveis/identificadores',
          cadastrar: '/erp/producao/identificaveis/identificadores/cadastrar'
        },
        equipamentos: {
          index: '/erp/producao/identificaveis/equipamentos',
          cadastrar: '/erp/producao/identificaveis/equipamentos/cadastrar'
        },
        index: '/erp/producao/identificaveis'
      },
      rastreadores: {
        index: '/erp/producao/rastreadores',
        cadastrar: '/erp/producao/rastreadores/cadastrar'
      },
      kits: {
        kitsDeInsumo: {
          index: '/erp/producao/kits/kits-de-insumo',
          cadastrar: '/erp/producao/kits/kits-de-insumo/cadastrar',
          tipos: {
            index: '/erp/producao/kits/kits-de-insumo/tipos',
            cadastrar: '/erp/producao/kits/kits-de-insumo/tipos/cadastrar'
          }
        },
        kitsDeInstalacao: {
          index: '/erp/producao/kits/kits-de-instalacao',
          cadastrar: '/erp/producao/kits/kits-de-instalacao/cadastrar'
        },
        index: '/erp/producao/kits'
      },
      index: '/erp/producao'
    },
    compras: {
      produtos: {
        index: '/erp/compras/produtos',
        cadastrar: '/erp/compras/produtos/cadastrar'
      },
      pedidos: {
        index: '/erp/compras/pedidos',
        cadastrar: '/erp/compras/pedidos/cadastrar'
      },
      index: '/erp/compras'
    },
    configuracoes: {
      index: '/erp/configuracoes'
    },
    kanban: '/erp/kanban',
    calendario: '/erp/calendario',
    mapa: '/erp/mapa',
    index: '/erp'
  },
  assistencia: {
    home: '/assistencia/',
    index: '/assistencia/'
  },
  rastreamento: {
    home: '/rastreamento/',
    index: '/rastreamento/'
  },
  login: '/login/'
} as const
