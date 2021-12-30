import { useForm, Controller } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as upSelling from '@/domains/erp/commercial/Services/Tabs/UpSelling'
import * as combos from '@/domains/erp/commercial/Combos'

import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'
import router from 'next/router'
import rotas from '@/domains/routes'
import { BRLMoneyInputFormat, BRLMoneyUnformat } from 'utils/formaters'

type FormData = {
  Nome: string
  Combo_Id: {
    key: string
    title: string
  }
  Valor: string
  Servico_Id: {
    key: string
    title: string
  }
}

export default function CreateUpSelling() {
  const { combosData } = combos.useList()
  const {
    createUpSellingLoading,
    createUpSelling,
    setSlidePanelState,
    upSellingRefetch,
    upSellingSchema
  } = upSelling.useUpSelling()
  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm({
    resolver: yupResolver(upSellingSchema)
  })
  const onSubmit = (formData: FormData) => {
    createUpSelling({
      variables: {
        Nome: formData.Nome,
        Combo_Id: formData.Combo_Id.key,
        Valor: BRLMoneyUnformat(formData.Valor)
      }
    })
      .then(() => {
        upSellingRefetch()
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
        <Controller
          control={control}
          name="Combo_Id"
          render={({ field: { onChange, value } }) => (
            <div>
              <form.Select
                itens={
                  combosData
                    ? combosData.map((item) => {
                        return { key: item.Id, title: item.Nome }
                      })
                    : []
                }
                value={value}
                onChange={onChange}
                error={errors.Combo_Id}
                label="Combo"
              />
              <common.OpenModalLink
                onClick={() =>
                  router.push(rotas.erp.comercial.combos.cadastrar)
                }
              >
                Cadastrar combo
              </common.OpenModalLink>
            </div>
          )}
        />
        <Controller
          control={control}
          name="Valor"
          render={({ field: { onChange, value } }) => (
            <div>
              <form.Input
                fieldName="Valor"
                register={register}
                title="Valor"
                value={value}
                error={errors.Valor}
                onChange={(e) => {
                  onChange(BRLMoneyInputFormat(e))
                }}
              />
            </div>
          )}
        />
      </div>
      <common.Separator />
      <buttons.PrimaryButton
        title="Enviar"
        disabled={createUpSellingLoading}
        loading={createUpSellingLoading}
      />
    </form>
  )
}
