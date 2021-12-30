import nc from 'next-connect'
import type { NextApiRequest, NextApiResponse } from 'next'

import {
  handlerCriaVeiculo,
  insereVeiculo
} from '../../../core/domains/cadastroDeVeiculo'
import { insereCliente } from '../../../core/domains/identidades/cadastrosDeCliente'

const handler = nc<NextApiRequest, NextApiResponse>()

handler.get(async (req, res) => {
  try {
    const dadosFormatadosParaInsercao = await handlerCriaVeiculo(
      req.query.licensePlate as string
    )
    // const veiculoCadastrado = await insereVeiculo(
    //   'QGF6992',
    //   dadosFormatadosParaInsercao
    // )

    return res.status(200).json({
      // veiculoCadastrado: veiculoCadastrado,
      data: dadosFormatadosParaInsercao
    })
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Não foi possivel se comunicar com a api', error })
  }
})

export const config = {
  api: {
    bodyParser: true
  }
}

export default handler
