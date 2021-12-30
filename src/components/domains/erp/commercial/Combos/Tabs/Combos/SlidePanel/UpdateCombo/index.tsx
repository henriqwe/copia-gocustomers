import { Controller, useForm } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as combos from '@/domains/erp/commercial/Combos/Tabs/Combos'
import * as mainCombo from '@/domains/erp/commercial/Combos'

import { useEffect } from 'react'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'
import {
  BRLMoneyInputDefaultFormat,
  BRLMoneyInputFormat,
  BRLMoneyUnformat
} from 'utils/formaters'

type FormData = {
  Valor: string
  Combo: {
    key: string
    title: string
  }
}

export default function UpdateCombo() {
  const {
    updateDependenceComboLoading,
    updateDependenceCombo,
    setSlidePanelState,
    slidePanelState,
    combosRefetch,
    dependenceComboSchema,
    combosData,
    dependenciesCombosRefetch
  } = combos.useDependenceCombo()
  const { comboRefetch } = mainCombo.useView()
  const {
    handleSubmit,
    reset,
    formState: { errors },
    control
  } = useForm({
    resolver: yupResolver(dependenceComboSchema)
  })
  const onSubmit = (formData: FormData) => {
    updateDependenceCombo({
      variables: {
        Id: slidePanelState.data?.Id,
        Valor: BRLMoneyUnformat(formData.Valor),
        Combo_Id: formData.Combo.key
      }
    })
      .then(() => {
        combosRefetch()
        dependenciesCombosRefetch()
        comboRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false }
        })
        notification(formData.Combo.title + ' editado com sucesso', 'success')
      })
      .catch((err) => {
        showError(err)
      })
  }

  useEffect(() => {
    reset({
      Valor:
        BRLMoneyInputDefaultFormat(
          slidePanelState.data?.Valor.toFixed(2).toString()
        ) || '',
      Combo: {
        key: slidePanelState.data?.Combo.Id || '',
        title: slidePanelState.data?.Combo.Nome || ''
      }
    })
  }, [slidePanelState.data, reset])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      data-testid="editForm"
      className="flex flex-col items-end"
    >
      <div className="flex flex-col w-full gap-2 mb-2">
        <Controller
          control={control}
          name={'Valor'}
          render={({ field: { onChange, value } }) => (
            <div>
              <form.Input
                fieldName={'Valor'}
                title={`Valor`}
                value={value}
                onChange={(e) => {
                  onChange(BRLMoneyInputFormat(e))
                }}
                icon="R$"
              />
            </div>
          )}
        />
        <Controller
          control={control}
          name="Combo"
          render={({ field: { onChange, value } }) => (
            <form.Select
              itens={
                combosData
                  ? combosData
                      .filter((combo) => combo.Combos.length === 0)
                      .map((combo) => {
                        return {
                          key: combo.Id,
                          title: combo.Nome
                        }
                      })
                  : []
              }
              value={value}
              onChange={onChange}
              error={errors.Combo}
              label="Combo"
            />
          )}
        />
      </div>
      <common.Separator />
      <buttons.PrimaryButton
        title="Editar"
        disabled={updateDependenceComboLoading}
        loading={updateDependenceComboLoading}
      />
    </form>
  )
}
