import nc from 'next-connect'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = nc<NextApiRequest, NextApiResponse>()

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Minio = require('minio')
const minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'minio',
  secretKey: 'minio123'
})

handler.get(async (req, res) => {
  const buckets = await minioClient.listBuckets().then((response) => response)
  const existeBuckect = await minioClient.bucketExists('documentos')
  return res.status(200).json({ teste: 'Hello World!', buckets, existeBuckect })
})

export const config = {
  api: {
    bodyParser: true
  }
}

export default handler
