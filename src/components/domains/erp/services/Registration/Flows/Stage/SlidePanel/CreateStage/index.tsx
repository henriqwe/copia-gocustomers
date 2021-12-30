import { Controller, useForm } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as flowStages from '@/domains/erp/services/Registration/Flows/Stage'
import * as flows from '@/domains/erp/services/Registration/Flows'

import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { GraphQLTypes } from 'graphql/generated/zeus'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'
import router from 'next/router'
import rotas from '@/domains/routes'

export default function CreateStage() {
  const { flowsData } = flows.useFlow()
  const {
    createFlowStageLoading,
    createFlowStage,
    setSlidePanelState,
    stagesRefetch,
    stageSchema
  } = flowStages.useStage()
  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm({
    resolver: yupResolver(stageSchema)
  })
  const onSubmit = (formData: GraphQLTypes['atendimentos_EtapasDosFluxos']) => {
    createFlowStage({
      variables: {
        Nome: formData.Nome,
        Posicao: formData.Posicao,
        Fluxo_Id: formData.Fluxo_Id.key
      }
    })
      .then(() => {
        stagesRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false }
        })
        notification(formData.Nome + ' cadastrado com sucesso', 'success')
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
          fieldName="Nome"
          register={register}
          title="Nome"
          error={errors.Nome}
          data-testid="inserirNome"
        />
        <form.Input
          fieldName="Posicao"
          register={register}
          title="Posição"
          error={errors.Posicao}
          data-testid="inserirPosicao"
        />
        <Controller
          control={control}
          name="Fluxo_Id"
          render={({ field: { onChange, value } }) => (
            <div>
              <form.Select
                itens={
                  flowsData
                    ? flowsData.map((item) => {
                        return { key: item.Id, title: item.Nome }
                      })
                    : []
                }
                value={value}
                onChange={onChange}
                error={errors.Fluxo_Id}
                label="Fluxo"
              />
              <common.OpenModalLink
                onClick={() =>
                  router.push(rotas.erp.atendimento.cadastros.fluxos.index)
                }
              >
                Cadastrar Fluxo
              </common.OpenModalLink>
            </div>
          )}
        />
      </div>
      <common.Separator />
      <buttons.PrimaryButton
        title="Enviar"
        disabled={createFlowStageLoading}
        loading={createFlowStageLoading}
      />
    </form>
  )
}
