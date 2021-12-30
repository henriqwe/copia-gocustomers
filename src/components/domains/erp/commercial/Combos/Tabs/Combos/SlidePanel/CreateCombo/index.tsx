import { Controller, useForm } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as combos from '@/domains/erp/commercial/Combos/Tabs/Combos'
import * as mainCombo from '@/domains/erp/commercial/Combos'

import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'
import { BRLMoneyInputFormat, BRLMoneyUnformat } from 'utils/formaters'

type FormData = {
  Valor: string
  Combo: {
    key: {
      Id: string
    }
    title: string
  }
}

export default function CreateCombo() {
  const {
    createDependenceComboLoading,
    createDependenceCombo,
    setSlidePanelState,
    dependenciesCombosRefetch,
    dependenceComboSchema,
    combosData,
    combosRefetch
  } = combos.useDependenceCombo()
  const { comboRefetch } = mainCombo.useView()
  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue
  } = useForm({
    resolver: yupResolver(dependenceComboSchema)
  })
  const onSubmit = (formData: FormData) => {
    createDependenceCombo({
      variables: {
        Valor: BRLMoneyUnformat(formData.Valor),
        Combo_Id: formData.Combo.key.Id
      }
    })
      .then(() => {
        combosRefetch()
        dependenciesCombosRefetch()
        comboRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false }
        })
        notification(
          formData.Combo.title + ' cadastrado com sucesso',
          'success'
        )
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
                          key: combo,
                          title: combo.Nome
                        }
                      })
                  : []
              }
              value={value}
              onChange={(e) => {
                setValue('Valor', e.key.Precos[0].Valor)
                onChange(e)
              }}
              error={errors.Combo}
              label="Combo"
            />
          )}
        />
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
                disabled={watch('Combo') === undefined}
                icon="R$"
              />
            </div>
          )}
        />
      </div>
      <common.Separator />
      <buttons.PrimaryButton
        title="Enviar"
        disabled={createDependenceComboLoading}
        loading={createDependenceComboLoading}
      />
    </form>
  )
}
