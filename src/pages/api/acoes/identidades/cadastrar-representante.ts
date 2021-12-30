import nc from 'next-connect'
import type { NextApiRequest, NextApiResponse } from 'next'
import { handlerCriaPessoa } from 'core/domains/pessoas/cadastroDePessoa'
import {
  BuscarPessoaExistente,
  insereRepresentante,
  insereRepresentanteEPessoa
} from 'core/domains/identidades/cadastrosDeRepresentante'

const handler = nc<NextApiRequest, NextApiResponse>()

handler.post(async (req, res) => {
  console.log('passou')
  const PessoaExistente = await BuscarPessoaExistente(
    req.body.input.Identificador
  )
  let dadosFormatadosParaInsercao = {}
  if (PessoaExistente.identidades_Pessoas.length === 0) {
    try {
      dadosFormatadosParaInsercao = await handlerCriaPessoa(
        req.body.input.Identificador, // 17595275000118
        req.body.input.PessoaJuridica
      )
    } catch (error) {
      return res
        .status(400)
        .json({ message: 'Não foi possivel se comunicar com a api', error })
    }
    try {
      const clienteCadastrado = await insereRepresentanteEPessoa(
        req.body.input.Identificador, // 17595275000118
        req.body.input.PessoaJuridica,
        req.body.input.PessoaRepresentada,
        dadosFormatadosParaInsercao
      )

      const { ['__typename']: remove, ...resposta } =
        clienteCadastrado.data?.insert_identidades_Representantes_one
      return res.status(200).json({ ...resposta })
    } catch (error) {
      return res.status(400).json(error)
    }
  }
  try {
    const clienteCadastrado = await insereRepresentante(
      PessoaExistente.identidades_Pessoas[0]?.Id as string,
      req.body.input.PessoaRepresentada
    )

    const { ['__typename']: remove, ...resposta } =
      clienteCadastrado.data?.insert_identidades_Representantes_one
    return res.status(200).json({ ...resposta })
  } catch (error) {
    console.log('passou', error)
    return res.status(400).json(error)
  }
})

export const config = {
  api: {
    bodyParser: true
  }
}

export default handler
