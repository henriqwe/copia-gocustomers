import { Controller, useForm } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as leads from '@/domains/erp/services/Leads'
import * as clients from '@/domains/erp/identities/Clients'

import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'
import router from 'next/router'
import rotas from '@/domains/routes'
import { phoneUnformat } from 'utils/formaters'

type FormData = {
  Id: string
  Nome: string
  Email: string
  Telefone: string
  Cliente_Id: {
    key: string
    title: string
  }
}

export default function CreateLead() {
  const {
    createLeadLoading,
    createLead,
    setSlidePanelState,
    leadsRefetch,
    leadSchema
  } = leads.useLead()
  const { clientsData } = clients.useList()
  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm({
    resolver: yupResolver(leadSchema)
  })
  const onSubmit = (formData: FormData) => {
    createLead({
      variables: {
        Nome: formData.Nome,
        Email: formData.Email,
        Telefone: phoneUnformat(formData.Telefone),
        Cliente_Id: formData.Cliente_Id ? formData.Cliente_Id.key : null
      }
    })
      .then(() => {
        leadsRefetch()
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
        <form.Input
          fieldName="Email"
          register={register}
          title="Email"
          error={errors.Email}
          data-testid="editEmail"
        />
        <form.BRPhoneInput
          control={control}
          register={register}
          error={errors.Telefone}
          data-testid="editTelefone"
        />
        <Controller
          control={control}
          name="Cliente_Id"
          render={({ field: { onChange, value } }) => (
            <div>
              <form.Select
                itens={
                  clientsData
                    ? clientsData.map((item) => {
                        return {
                          key: item.Id,
                          title: item.Pessoa?.Nome as string
                        }
                      })
                    : []
                }
                value={value}
                onChange={onChange}
                error={errors.Cliente_Id}
                label="Cliente (opcional)"
              />
              <common.OpenModalLink
                onClick={() =>
                  router.push(rotas.erp.identidades.clientes.cadastrar)
                }
              >
                Cadastrar Cliente
              </common.OpenModalLink>
            </div>
          )}
        />
      </div>
      <common.Separator />
      <buttons.PrimaryButton
        title="Enviar"
        disabled={createLeadLoading}
        loading={createLeadLoading}
      />
    </form>
  )
}
