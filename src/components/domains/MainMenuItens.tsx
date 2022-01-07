import { ChipIcon, HomeIcon } from '@heroicons/react/outline'
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
      title: 'Monitoramento',
      url: rotas.erp.monitoramento.index,
      icon: <ChipIcon className="w-4 h-4 mx-4" />,
      children: [
        {
          title: 'Localização',
          url: rotas.erp.monitoramento.localizacao,
          icon: <ChipIcon className="w-4 h-4 mx-4" />
        },
        {
          title: 'Trajetos',
          url: rotas.erp.monitoramento.trajetos,
          icon: <ChipIcon className="w-4 h-4 mx-4" />
        },
        {
          title: 'Comandos',
          url: rotas.erp.monitoramento.comandos,
          icon: <ChipIcon className="w-4 h-4 mx-4" />
        }
      ]
    }
  ]
}
