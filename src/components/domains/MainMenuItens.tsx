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
      title: 'Mapas',
      url: rotas.erp.mapas.mapa1,
      icon: <ChipIcon className="w-4 h-4 mx-4" />,
      children: [
        {
          title: 'Mapa 1',
          url: rotas.erp.mapas.mapa1,
          icon: <ChipIcon className="w-4 h-4 mx-4" />
        },
        {
          title: 'Mapa 2',
          url: rotas.erp.mapas.mapa2,
          icon: <ChipIcon className="w-4 h-4 mx-4" />
        }
      ]
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
