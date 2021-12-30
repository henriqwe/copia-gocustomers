import { useForm } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as questions from '@/domains/erp/services/Registration/Questions'

import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

type FormData = {
  Titulo: string
  Descricao: string
}

export default function CreateQuestion() {
  const {
    createQuestionLoading,
    createQuestion,
    setSlidePanelState,
    questionsRefetch,
    questionSchema
  } = questions.useQuestion()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(questionSchema)
  })
  const onSubmit = (formData: FormData) => {
    createQuestion({
      variables: {
        Titulo: formData.Titulo,
        Descricao: formData.Descricao
      }
    })
      .then(() => {
        questionsRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false }
        })
        notification(formData.Titulo + ' cadastrado com sucesso', 'success')
      })
      .catch((err) => {
        showError(err)
      })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      data-testid="inserirForm"
      className="flex flex-col items-end"
    >
      <div className="flex flex-col w-full gap-2 mb-2">
        <form.Input
          fieldName="Titulo"
          register={register}
          title="Título"
          error={errors.Titulo}
          data-testid="editTitulo"
        />
        <form.Input
          fieldName="Descricao"
          register={register}
          title="Descrição"
          error={errors.Descricao}
          data-testid="editDescricao"
        />
      </div>
      <common.Separator />
      <buttons.PrimaryButton
        title="Enviar"
        disabled={createQuestionLoading}
        loading={createQuestionLoading}
      />
    </form>
  )
}
