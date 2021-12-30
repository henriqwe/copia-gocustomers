import { Controller, useForm } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as contracts from '@/domains/erp/commercial/Contracts'
import * as partners from '@/domains/erp/commercial/Providers'

import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

type FormData = {
  Nome: string
  Parceiro: {
    key: string
    title: string
  }
}

export default function CreateContract() {
  const {
    createContractLoading,
    createContract,
    setSlidePanelState,
    baseContractsRefetch,
    baseContractSchema
  } = contracts.useContract()
  const { providersData } = partners.useProvider()
  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm({
    resolver: yupResolver(baseContractSchema)
  })
  const onSubmit = (formData: FormData) => {
    createContract({
      variables: {
        Nome: formData.Nome,
        Parceiro_Id: formData.Parceiro.key
      }
    })
      .then(() => {
        baseContractsRefetch()
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
          data-testid="editNome"
        />

        <Controller
          control={control}
          name="Parceiro"
          render={({ field: { onChange, value } }) => (
            <div className="col-span-2">
              <form.Select
                itens={
                  providersData
                    ? providersData.map((partner) => {
                        return {
                          key: partner.Id,
                          title: partner.Nome
                        }
                      })
                    : []
                }
                value={value}
                onChange={onChange}
                error={errors.Parceiro}
                label="Parceiro"
              />
            </div>
          )}
        />
      </div>
      <common.Separator />
      <buttons.PrimaryButton
        title="Enviar"
        disabled={createContractLoading}
        loading={createContractLoading}
      />
    </form>
  )
}
