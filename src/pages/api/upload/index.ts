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

// TODO: Refatorar funções de upload
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
          'documentos',
          `${id}/${req.query.documentName}.${fileExtension}`,
          fileStream,
          stats.size,
          async function (err: Error, objInfo: any) {
            if (err) {
              res.status(400).json({ data: 'fail' /*status: fileStat*/ }) // err should be null
              return
            }

            if (req.query.path === 'client') {
              const { data } = await useTypedClientQuery({
                identidades_Clientes_Documentos: [
                  {
                    where: {
                      Pessoa_Id: { _eq: id },
                      Nome: { _eq: req.query.documentName as string }
                    }
                  },
                  { Id: true }
                ]
              })

              Fs.unlink(fullFilePath, (err: Error) => {
                if (err) {
                  console.error(err)
                  return
                }
              })

              if (data.identidades_Clientes_Documentos.length === 0) {
                useTypedClientMutation({
                  insert_identidades_Clientes_Documentos_one: [
                    {
                      object: {
                        Nome: req.query.documentName as string,
                        Pessoa_Id: id
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
              useTypedClientMutation({
                update_identidades_Clientes_Documentos_by_pk: [
                  {
                    pk_columns: {
                      Id: data.identidades_Clientes_Documentos[0].Id
                    },
                    _set: {
                      updated_at: new Date(),
                      DataAprovado: null,
                      DataRecusado: null,
                      MotivoRecusa: null,
                      Situacao_Id: 'anexado'
                    }
                  },
                  {
                    Id: true
                  }
                ]
              })
            }
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
      'documentos',
      `${clientId}/${req.query.documentName}.png`,
      function (error, dataStream) {
        if (error) {
          console.log(error)
          res.status(400).json({ data: 'fail' /*status: fileStat*/ }) // err should be null
          return
        }
        console.log(dataStream)
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
