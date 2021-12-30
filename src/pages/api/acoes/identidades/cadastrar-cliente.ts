import nc from 'next-connect'
import type { NextApiRequest, NextApiResponse } from 'next'
import { handlerCriaPessoa } from 'core/domains/pessoas/cadastroDePessoa'
import {
  BuscarPessoaExistente,
  insereCliente,
  insereClienteEPessoa
} from 'core/domains/identidades/cadastrosDeCliente'

const handler = nc<NextApiRequest, NextApiResponse>()

handler.post(async (req, res) => {
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
      const clienteCadastrado = await insereClienteEPessoa(
        req.body.input.Identificador, // 17595275000118
        req.body.input.PessoaJuridica,
        dadosFormatadosParaInsercao
      )

      const { ['__typename']: remove, ...resposta } =
        clienteCadastrado.data?.insert_identidades_Clientes_one
      return res.status(200).json({ ...resposta })
    } catch (error) {
      return res.status(400).json(error)
    }
  }
  try {
    const clienteCadastrado = await insereCliente(
      PessoaExistente.identidades_Pessoas[0]?.Id as string
    )
    const { ['__typename']: remove, ...resposta } =
      clienteCadastrado.data?.insert_identidades_Clientes_one
    return res.status(200).json({ ...resposta })
  } catch (error) {
    return res.status(400).json(error)
  }
})

export const config = {
  api: {
    bodyParser: true
  }
}

export default handler
