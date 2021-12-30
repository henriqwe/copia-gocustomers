import nextConnect from 'next-connect'
import multer from 'multer'
import { NextApiRequest, NextApiResponse } from 'next'

type NextApiRequestWithFormData = NextApiRequest &
  Request & {
    files: any[]
  }

type NextApiResponseCustom = NextApiResponse & Response

const uploadComMulter = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => cb(null, file.originalname)
  })
})

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Minio = require('minio')
const minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'minio',
  secretKey: 'minio123'
})

const apiRoute = nextConnect({
  onError(error, req, res) {
    console.log(error)
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` })
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` })
  }
})

apiRoute.use(uploadComMulter.array('arquivos'))

apiRoute.get((req: NextApiRequestWithFormData, res: NextApiResponseCustom) => {
  try {
    const clientId = req.query.id
    minioClient.presignedUrl(
      'GET',
      'contratos',
      `${clientId}/${req.query.documentName}.pdf`,
      24 * 60 * 60,
      { versionId: req.query.version },
      function (err: Error, presignedUrl: string) {
        if (err) return console.log(err)
        res.status(200).json({ url: presignedUrl })
      }
    )
  } catch (error) {
    res.status(400).json({ error })
  }
})

export default apiRoute

export const config = {
  api: {
    bodyParser: false // Disallow body parsing, consume as stream
  }
}
