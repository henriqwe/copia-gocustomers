import nextConnect from 'next-connect'
import multer from 'multer'
import { NextApiRequest, NextApiResponse } from 'next'
import {
  useTypedClientMutation,
  useTypedClientQuery
} from 'graphql/generated/zeus/apollo'

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

apiRoute.post(
  async (req: NextApiRequestWithFormData, res: NextApiResponseCustom) => {
    const id = req.query.id
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Fs = require('fs')
    const file = req.files[0]
    const fullFilePath = `./public/uploads/${file.originalname}`
    const fileExtension = file.mimetype.split('/')[1]
    const fileStream = Fs.createReadStream(fullFilePath)
    const fileStat = Fs.stat(
      fullFilePath,
      async function (err: Error, stats: any) {
        if (err) {
          return console.log(err)
        }
        minioClient.putObject(
          'contratos',
          `${id}/${req.query.documentName}.${fileExtension}`,
          fileStream,
          stats.size,
          async function (err: Error, objInfo: any) {
            if (err) {
              res.status(400).json({ data: 'fail' /*status: fileStat*/ }) // err should be null
              return
            }

            let response: any
            switch (req.query.path) {
              case 'contracts':
                response = await useTypedClientQuery({
                  comercial_ContratosBase_Versoes: [
                    {
                      order_by: [{ created_at: 'desc' }],
                      where: {
                        deleted_at: { _is_null: true },
                        ContratoBase_Id: { _eq: id }
                      }
                    },
                    {
                      Id: true,
                      Versao: true
                    }
                  ]
                })
                if (
                  response.data.comercial_ContratosBase_Versoes[0].Versao !==
                  objInfo.versionId
                ) {
                  useTypedClientMutation({
                    insert_comercial_ContratosBase_Versoes_one: [
                      {
                        object: {
                          Versao: objInfo.versionId,
                          ContratoBase_Id: id
                        }
                      },
                      {
                        Id: true
                      }
                    ]
                  })
                  return res
                    .status(200)
                    .json({ data: 'success' /*status: fileStat*/ })
                }
                break
            }

            Fs.unlink(fullFilePath, (err: Error) => {
              if (err) {
                console.error(err)
                return
              }
            })

            return res
              .status(200)
              .json({ data: 'success' /*status: fileStat*/ })
          }
        )
      }
    )
  }
)

apiRoute.get((req: NextApiRequestWithFormData, res: NextApiResponseCustom) => {
  let itemExists = false
  try {
    const clientId = req.query.id
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    let size = 0
    minioClient.getObject(
      'contratos',
      `${clientId}/${req.query.documentName}.png`,
      function (error: Error, dataStream) {
        if (error) {
          console.log(error)
          res.status(400).json({ data: 'fail' /*status: fileStat*/ }) // err should be null
          return
        }
        try {
          dataStream.on('data', function (chunk) {
            size += chunk.length
          })

          dataStream.on('end', () => {
            itemExists = true
            res.status(200).json({ itemExists, size })
          })

          dataStream.on('error', function (err) {
            res.status(400).json({ err })
          })
        } catch (error) {
          console.log('inside', error)
          res.status(400).json({ error })
        }
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
