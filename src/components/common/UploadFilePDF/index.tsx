import axios from 'axios'
import { useMemo, useState } from 'react'
import { useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import * as common from '@/common'

import { notification } from 'utils/notification'

type UploadFilePDFProps = {
  multiplo?: string
  documentName: string
  Id: string
  path: string
  refetch?: () => void
  title?: string
  apiRoute?: string
  disabled?: boolean
}

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#3e3e3e',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
}

const activeStyle = {
  borderColor: '#2196f3'
}

const acceptStyle = {
  borderColor: '#00e676'
}

const rejectStyle = {
  borderColor: '#ff1744'
}

const UploadFilePDF = ({
  documentName,
  Id,
  path,
  refetch,
  title = 'Clique para fazer upload do seu PDF',
  apiRoute = '/api/upload/contrato',
  disabled = false
}: UploadFilePDFProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({ disabled: isLoading || disabled, accept: '.pdf' })

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }),
    [isDragActive, isDragReject, isDragAccept]
  )

  async function submitFiles() {
    setIsLoading(true)
    await enviaArquivos(acceptedFiles, documentName, path, apiRoute, Id)
      .then(() => {
        // FIXME: remover setTimeOut
        setTimeout(async () => {
          refetch && refetch()
          notification('Arquivo inserido com sucesso', 'success')
        }, 1000)
      })
      .catch((err) => notification('Ops! algo deu errado', 'error'))
  }

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      submitFiles().finally(() => {
        setIsLoading(false)
      })
    }
  }, [acceptedFiles])

  return (
    <section className="container">
      <div
        {...getRootProps({
          style
        })}
      >
        <input {...getInputProps()} />
        {isLoading ? (
          <common.AnimatedSpin className="w-5 h-5" />
        ) : (
          <p>{title}</p>
        )}
      </div>
    </section>
  )
}

async function enviaArquivos(
  arquivosTemporarios: any,
  documentName: string,
  path: string,
  apiRoute: string,
  Id?: string
) {
  const arquivos = constroiFormularioComArquivo(arquivosTemporarios)
  const parametrosDeEnvio = {
    headers: { 'content-type': 'multipart/form-data' },
    params: {
      id: Id,
      documentName,
      path
    }
  }

  const response = await axios
    .post(apiRoute, arquivos, parametrosDeEnvio)
    .catch((error) => {
      throw new Error(error)
    })

  return response
}

function constroiFormularioComArquivo(arquivos) {
  const formulario = new FormData()

  Array.from(arquivos).forEach((file) => {
    formulario.append('arquivos', file)
  })
  return formulario
}

// function exibeArquivos(arquivos) {
//   const files = arquivos.map((file) => (
//     <li key={file.path}>
//       {file.path} - {file.size} bytes
//     </li>
//   ))
// }

export default UploadFilePDF
