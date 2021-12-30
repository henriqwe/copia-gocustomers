import { Controller, useForm } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as chips from '@/domains/erp/production/identifiable/Chips'
import * as operators from '@/domains/erp/production/identifiable/Chips/Operators'

import { useEffect } from 'react'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'
import { phoneUnformat, phoneFormat } from 'utils/formaters'

type FormData = {
  Iccid: string
  Operadora_Id: {
    key: string
  }
  Telefone: string
}

export default function Update() {
  const {
    updateChip,
    updateChipLoading,
    setSlidePanelState,
    slidePanelState,
    chipsRefetch,
    chipsSchema,
    cancelChip,
    cancelChipLoading,
    suspendChip,
    suspendChipLoading,
    activateChip,
    activateChipLoading,
    suspendChipsSchema
  } = chips.useChips()
  const { operatorsData, setSlidePanelState: operatorsSlidePanel } =
    operators.useOperator()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
    watch
  } = useForm({
    resolver: yupResolver(chipsSchema)
  })
  const {
    register: suspenderRegister,
    handleSubmit: suspenderHandleSubmit,
    formState: { errors: suspenderErrors }
  } = useForm(
    watch('Acao') && watch('Acao').key === 'suspenso'
      ? {
          resolver: yupResolver(suspendChipsSchema)
        }
      : {}
  )
  const onSubmit = (formData: FormData) => {
    updateChip({
      variables: {
        Id: slidePanelState.data?.Id,
        Iccid: formData.Iccid,
        Operadora_Id: formData.Operadora_Id.key,
        NumeroDaLinha: phoneUnformat(formData.Telefone)
      }
    })
      .then(() => {
        chipsRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false }
        })
        notification(formData.Telefone + ' editado com sucesso', 'success')
      })
      .catch((err) => {
        showError(err)
      })
  }

  useEffect(() => {
    reset({
      Iccid: slidePanelState.data?.Iccid || '',
      Telefone: phoneFormat(slidePanelState.data?.NumeroDaLinha) || '',
      Operadora_Id: {
        key: slidePanelState.data?.Operadora.Id || '',
        title: slidePanelState.data?.Operadora.Nome || ''
      }
    })
    setSlidePanelState((oldState) => {
      return {
        ...oldState,
        situation: slidePanelState.data?.Situacao?.Valor as string
      }
    })
  }, [slidePanelState.data, reset, setSlidePanelState])

  function getModalTitle(camelcase = false) {
    let title = camelcase ? 'Cancelar' : 'cancelar'

    if (watch('Acao')) {
      switch (watch('Acao').key) {
        case 'suspenso':
          title = camelcase ? 'Suspender' : 'suspender'
          break
        case 'ativo':
          title = camelcase ? 'Ativar' : 'ativar'
          break
      }
    }

    return title
  }

  function funcaoPrincipal(formData: { Duracao: string }) {
    if (watch('Acao').key === 'cancelado') {
      cancelChip({
        variables: {
          Id: slidePanelState.data?.Id
        }
      })
      setSlidePanelState((oldState) => {
        return { ...oldState, showModal: false, situation: 'cancelado' }
      })
      chipsRefetch()
      return
    }
    if (watch('Acao').key === 'suspenso') {
      suspendChip({
        variables: {
          Id: slidePanelState.data?.Id,
          TempoDaSuspensao: formData.Duracao || ''
        }
      })
      setSlidePanelState((oldState) => {
        return { ...oldState, showModal: false, situation: 'suspenso' }
      })
      chipsRefetch()
      return
    }

    activateChip({
      variables: {
        Id: slidePanelState.data?.Id
      }
    })
    setSlidePanelState((oldState) => {
      return { ...oldState, showModal: false, situation: 'ativo' }
    })
    chipsRefetch()
  }

  function actionsType() {
    let acoes: { key: string; title: string }[] = [
      { key: 'cancelado', title: 'Cancelar chip' },
      { key: 'suspenso', title: 'Suspender chip' },
      { key: 'ativo', title: 'Ativar chip' }
    ]

    switch (slidePanelState.situation) {
      case 'cancelado':
        acoes = [
          { key: 'ativo', title: 'Ativar chip' },
          { key: 'suspenso', title: 'Suspender chip' }
        ]
        break
      case 'suspenso':
        acoes = [
          { key: 'cancelado', title: 'Cancelar chip' },
          { key: 'ativo', title: 'Ativar chip' }
        ]
        break
      case 'ativo':
        acoes = [
          { key: 'cancelado', title: 'Cancelar chip' },
          { key: 'suspenso', title: 'Suspender chip' }
        ]
        break
    }

    return acoes
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        data-testid="editForm"
        className="flex flex-col items-end"
      >
        <div className="flex flex-col w-full gap-2 mb-2">
          <Controller
            name="Iccid"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="col-span-2">
                <form.Input
                  fieldName="Iccid"
                  title="ICCID"
                  onChange={(e) => {
                    if (e.target.value.length < 21) {
                      onChange(e.target.value)
                    }
                  }}
                  value={value}
                  error={errors.Iccid}
                />
              </div>
            )}
          />

          <div className="col-span-2">
            <form.BRPhoneInput
              control={control}
              error={errors.Telefone}
              register={register}
            />
          </div>

          <Controller
            name="Operadora_Id"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="col-span-2">
                <form.Select
                  itens={
                    operatorsData
                      ? operatorsData.map((operadora) => {
                          return {
                            key: operadora.Id,
                            title: operadora.Nome
                          }
                        })
                      : []
                  }
                  value={value}
                  onChange={onChange}
                  error={errors.Operadora_Id}
                  label="Operadora"
                />
                <common.OpenModalLink
                  onClick={() =>
                    operatorsSlidePanel({ open: true, type: 'create' })
                  }
                >
                  Cadastrar operadora
                </common.OpenModalLink>
              </div>
            )}
          />
        </div>
        <common.Separator />
        <section className="grid justify-between w-full grid-cols-6">
          <Controller
            name="Acao"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="col-span-3">
                <form.Select
                  itens={actionsType()}
                  value={value}
                  onChange={(e) => {
                    setSlidePanelState((oldState) => {
                      return { ...oldState, showModal: true }
                    })
                    onChange(e)
                  }}
                  error={errors.Operadora_Id}
                  label="Selecione uma ação"
                />
              </div>
            )}
          />

          <div className="col-span-2" />
          <div>
            <buttons.PrimaryButton
              title="Editar"
              disabled={updateChipLoading}
              loading={updateChipLoading}
            />
          </div>
        </section>
      </form>
      <common.Modal
        handleSubmit={suspenderHandleSubmit(funcaoPrincipal)}
        open={slidePanelState.showModal}
        disabled={
          cancelChipLoading || suspendChipLoading || activateChipLoading
        }
        description={`Deseja mesmo ${getModalTitle()} esse chip?`}
        onClose={() =>
          setSlidePanelState((oldState) => {
            return { ...oldState, showModal: false }
          })
        }
        buttonTitle={`${getModalTitle(true)} chip`}
        modalTitle={`${getModalTitle(true)} chip?`}
      >
        {watch('Acao') && watch('Acao').key === 'suspenso' && (
          <div className="my-2">
            <form.Input
              fieldName="Duracao"
              title="Tempo em horas da suspensão"
              register={suspenderRegister}
              error={suspenderErrors.Duracao}
            />
          </div>
        )}
      </common.Modal>
    </div>
  )
}
