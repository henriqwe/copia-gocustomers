import { useRouter } from 'next/router'
import { useForm, Controller } from 'react-hook-form'

import rotas from '@/domains/routes'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as questionsGroup from '@/domains/erp/services/Registration/Questions/Groups'
import * as questions from '@/domains/erp/services/Registration/Questions'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'
import { useEffect, useState } from 'react'

const UpdateQuestionGroup = () => {
  const router = useRouter()
  const {
    updateQuestionsGroup,
    updateQuestionsGroupLoading,
    questionsGroupData,
    updateQuestionsGroupQuestion,
    updateQuestionsGroupQuestionLoading
  } = questionsGroup.useUpdate()
  const { questionsData } = questions.useQuestion()
  const { control, handleSubmit, register, watch } = useForm()
  const [questionsArray, setQuestionsArray] = useState(questionsData)

  async function onSubmit(data: any) {
    try {
      let itensValues = questionsGroupData!.Perguntas.map((item, index) => {
        if (!data['Pergunta_Id' + index]) {
          return
        }

        return {
          Pergunta_Id: data['Pergunta_Id' + index].key,
          Id: item.Id
        }
      })

      itensValues = itensValues.filter(
        (item) => item?.Pergunta_Id !== undefined
      )

      itensValues.map((item) => {
        updateQuestionsGroupQuestion({
          variables: {
            Id: item?.Id,
            Pergunta_Id: item?.Pergunta_Id
          }
        })
      })

      await updateQuestionsGroup({
        variables: {
          Nome: data.Nome === '' ? questionsGroupData?.Nome : data.Nome
        }
      }).then(async () => {
        router.push(rotas.erp.atendimento.cadastros.perguntas.grupos.index)
        notification('Grupo de perguntas editado com sucesso', 'success')
      })
    } catch (err: any) {
      showError(err)
    }
  }

  useEffect(() => {
    const selectedItens = questionsGroupData?.Perguntas.map((_, index) => {
      if (watch('Pergunta_Id' + index) !== undefined) {
        return watch('Pergunta_Id' + index).key
      }
    })

    const unSelectedItens = questionsData?.filter((questionData) => {
      return !selectedItens?.includes(questionData.Id)
    })

    setQuestionsArray(
      unSelectedItens?.map((unSelectedItem) => {
        return {
          Id: unSelectedItem.Id,
          Titulo: unSelectedItem.Titulo,
          Descricao: unSelectedItem.Descricao
        }
      })
    )
  }, [questionsGroupData])

  useEffect(() => {
    setQuestionsArray(questionsData)
  }, [questionsData])

  return (
    <common.Card>
      <form>
        <common.GenericTitle
          title="Dados do grupo de pergunta"
          subtitle="Nome e perguntas"
          className="px-6"
        />
        <common.Separator />

        <form.FormLine position={1} grid={3}>
          <form.Input
            fieldName="Nome"
            defaultValue={questionsGroupData?.Nome}
            register={register}
            title="Nome"
          />
        </form.FormLine>

        {questionsGroupData?.Perguntas.map((item, index) => (
          <form.FormLine position={index} grid={5} key={index}>
            <Controller
              name={'Pergunta_Id' + index}
              defaultValue={{
                key: item.Pergunta.Id,
                title: item.Pergunta.Titulo + ' - ' + item.Pergunta.Descricao
              }}
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="col-span-3">
                  <form.Select
                    itens={
                      questionsArray
                        ? questionsArray.map((question) => {
                            return {
                              key: question.Id,
                              title:
                                question.Titulo + ' - ' + question.Descricao
                            }
                          })
                        : []
                    }
                    value={value}
                    onChange={(newValue) => {
                      setQuestionsArray(() => {
                        if (value !== undefined) {
                          questionsArray?.push({
                            Id: value.key,
                            Titulo: value.title.split(' - ')[0],
                            Descricao: value.title.split(' - ')[1]
                          })
                        }
                        return questionsArray?.filter((item) => {
                          return item.Id !== newValue.key
                        })
                      })
                      onChange(newValue)
                    }}
                    label="Pergunta"
                  />
                </div>
              )}
            />
          </form.FormLine>
        ))}
      </form>
      <div className="flex items-center justify-between w-full px-6 mt-4">
        <buttons.GoBackButton />
        <buttons.PrimaryButton
          title="Confirmar"
          disabled={
            updateQuestionsGroupLoading || updateQuestionsGroupQuestionLoading
          }
          onClick={handleSubmit(onSubmit)}
          loading={
            updateQuestionsGroupLoading || updateQuestionsGroupQuestionLoading
          }
        />
      </div>
    </common.Card>
  )
}

export default UpdateQuestionGroup
