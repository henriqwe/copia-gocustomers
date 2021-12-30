import nc from 'next-connect'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = nc<NextApiRequest, NextApiResponse>()

handler.get(async (req, res) => {
  console.log(req.body)
})

export const config = {
  api: {
    bodyParser: true
  }
}

export default handler
