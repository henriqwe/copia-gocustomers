import axios from 'axios'
import { useMemo, useState } from 'react'
import { useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import * as buttons from '@/common/Buttons'
import * as common from '@/common'
import * as form from '@/common/Form'
import * as icons from '@/common/Icons'

import { notification } from 'utils/notification'
import {
  ApolloCache,
  DefaultContext,
  FetchResult,
  MutationFunctionOptions,
  OperationVariables
} from '@apollo/client'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { showError } from 'utils/showError'

type UploadFileProps = {
  multiplo?: string
  documentName: string
  Id: string
  loading: boolean
  path: string
  getId: (
    Name: string,
    ClientId: string
  ) => Promise<
    {
      Id: string
      Situacao?: {
        Valor: string
      }
      MotivoRecusa?: string
    }[]
  >
  approveDocument: (
    options?: MutationFunctionOptions<
      any,
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  declineDocument: (
    options?: MutationFunctionOptions<
      any,
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  refetch: () => void
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

const UploadFile = ({
  documentName,
  Id,
  getId,
  approveDocument,
  declineDocument,
  loading,
  path,
  refetch
}: UploadFileProps) => {
  const [itemExists, setItemExists] = useState(false)
  const [edit, setEdit] = useState(false)
  const [documentId, setDocumentId] = useState<string>()
  const [situation, setSituation] = useState<string>()
  const [openSlide, setOpenSlide] = useState(false)
  const [declineMotive, setDeclineMotive] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({ disabled: isLoading })
  const schema = yup.object().shape({
    MotivoRecusado: yup.string().required('Preencha o campo para continuar')
  })
  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm({ resolver: yupResolver(schema) })

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
    await enviaArquivos(acceptedFiles, documentName, path, Id)
      .then(() => {
        // FIXME: remover setTimeOut
        setTimeout(async () => {
          await getId(documentName, Id).then((response) => {
            if (response.length > 0) {
              setDocumentId(response[response.length - 1].Id)
              setSituation(response[response.length - 1].Situacao?.Valor)
              setDeclineMotive(response[response.length - 1]?.MotivoRecusa)
              setItemExists(true)
              setEdit(false)
              notification('Envio concluído', 'success')
            }
          })
        }, 1000)
      })
      .catch((err) => notification('Ops! algo deu errado', 'error'))
  }

  async function approveDocumentSubmit() {
    await approveDocument({
      variables: {
        Id: documentId
      }
    }).then(() => {
      refetch()
      setSituation('aprovado')
      notification('Documento aprovado com sucesso', 'success')
    })
  }

  async function declineDocumentSubmit(formData: { MotivoRecusado: string }) {
    await declineDocument({
      variables: {
        Id: documentId,
        MotivoRecusa: formData.MotivoRecusado
      }
    }).then(() => {
      refetch()
      setOpenSlide(false)
      setSituation('recusado')
      notification('Documento recusado com sucesso', 'success')
    })
  }

  useEffect(() => {
    axios
      .get<any>('/api/upload', {
        params: { id: Id, documentName }
      })
      .then((response) => {
        setItemExists(response.data.itemExists)
      })
      .catch((error) => null)
  }, [])

  useEffect(() => {
    getId(documentName, Id).then((response) => {
      if (response.length > 0) {
        setDocumentId(response[response.length - 1].Id)
        setSituation(response[response.length - 1].Situacao?.Valor)
        setDeclineMotive(response[response.length - 1]?.MotivoRecusa)
      }
    })
  }, [Id])

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      submitFiles().finally(() => {
        setIsLoading(false)
      })
    }
  }, [acceptedFiles])

  if (!itemExists) {
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
            <p>Clique para fazer upload</p>
          )}
        </div>
      </section>
    )
  }

  return (
    <section>
      <p>
        Situação: {situation}{' '}
        {declineMotive ? <span>- {declineMotive}</span> : null}
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-end gap-4 justify-star">
          <buttons.SecondaryButton
            handler={async () => {
              await axios
                .get<any>('/api/upload/presigned', {
                  params: { id: Id, documentName }
                })
                .then((response) => window.open(response.data.url, '_ blank'))
                .catch((error) =>
                  notification(error /*'Ops, algo deu errado'*/, 'error')
                )
            }}
            title={<icons.ViewIcon />}
            disabled={edit}
            buttonClassName="my-2"
          />

          {edit ? (
            <buttons.CancelButton
              onClick={() => setEdit(false)}
              title=""
              icon={<icons.BlockIcon />}
            />
          ) : (
            <buttons.PrimaryButton
              title={<icons.EditIcon className="w-5 h-5 text-white" />}
              onClick={() => setEdit(true)}
              disabled={situation === 'aprovado'}
            />
          )}
        </div>

        <div className="flex items-end justify-end gap-4">
          <buttons.CancelButton
            onClick={() => setOpenSlide(true)}
            title=""
            icon={<icons.BlockIcon />}
            disabled={situation !== 'anexado'}
          />

          <buttons.PrimaryButton
            title={<icons.CheckIcon className="w-5 h-5" />}
            onClick={approveDocumentSubmit}
            disabled={situation !== 'anexado'}
          />
        </div>
      </div>
      {edit && (
        <section className="container">
          <div {...getRootProps({ style })}>
            <input {...getInputProps()} />
            <p>Clique para fazer upload</p>
          </div>
        </section>
      )}
      <common.Modal
        handleSubmit={handleSubmit(declineDocumentSubmit)}
        open={openSlide}
        disabled={loading}
        description="Deseja mesmo recusar esse documento?"
        onClose={() => setOpenSlide(false)}
        buttonTitle="Recusar documento"
        modalTitle="Recusar documento?"
        color="red"
      >
        <div className="my-2">
          <form.Input
            fieldName="MotivoRecusado"
            title="Motivo da recusa"
            register={register}
            error={errors.MotivoRecusado}
          />
        </div>
      </common.Modal>
    </section>
  )
}

async function enviaArquivos(
  arquivosTemporarios: any,
  documentName: string,
  path: string,
  Id?: string
) {
  const arquivos = constroiFormularioComArquivo(arquivosTemporarios)
  const parametrosDeEnvio = {
    headers: { 'content-type': 'multipart/form-data' },
    params: {
      id: Id,
      documentName,
      path
    },
    onUploadProgress: (event) => {
      // console.log(
      //   `Current progress:`,
      //   Math.round((event.loaded * 100) / event.total)
      // )
    }
  }

  const response = await axios
    .post('/api/upload', arquivos, parametrosDeEnvio)
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

export default UploadFile
