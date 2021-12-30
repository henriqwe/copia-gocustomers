import nc from 'next-connect'
import type { NextApiRequest, NextApiResponse } from 'next'

import { useTypedClientMutation, $ } from 'graphql/generated/zeus/apollo'

const handler = nc<NextApiRequest, NextApiResponse>()

handler.post(async (req, res) => {
  const nomeDaTable =
    req.body.table.schema == 'public' ? '' : '_' + req.body.table.schema
  const nomeDaOperacao = 'insert' + nomeDaTable + '_Logs_one'
  await useTypedClientMutation(
    {
      [nomeDaOperacao]: [
        {
          object: {
            Tipo: $`Tipo`,
            Tipo_Id: $`Tipo_Id`,
            DadosAntigos: $`DadosAntigos`,
            DadosNovos: $`DadosNovos`,
            Operacao: $`Operacao`
          }
        },
        {
          Id: true,
          Tipo: true
        }
      ]
    },
    {
      Tipo: req.body.table.name,
      Tipo_Id: req.body.event.data.new.Id,
      DadosAntigos:
        req.body.event.data.old != null ? req.body.event.data.old : [],
      DadosNovos:
        req.body.event.data.new != null ? req.body.event.data.new : [],
      Operacao: req.body.event.op
    }
  )

  return res.status(200).json({})
})

export const config = {
  api: {
    bodyParser: true
  }
}

export default handler
