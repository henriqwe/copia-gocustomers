import { useEffect, useState } from 'react'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as serviceOrders from '@/domains/erp/operational/ServiceOrders'
import * as activities from '@/domains/erp/operational/ServiceOrders/Tabs/Activities'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'
import { datetimeFormat } from 'utils/formaters'
type FormData = {
  DataAgendamento: Date
}

export default function UpdateServiceOrders() {
  const [activeEdit, setActiveEdit] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const {
    updateServiceOrdersLoading,
    updateServiceOrders,
    serviceOrderData,
    serviceOrderRefetch,
    serviceOrdersSchema,
    concludeServiceOrder,
    concludeServiceOrderLoading,
    rejectServiceOrder,
    rejectServiceOrderLoading,
    rejectSchema
  } = serviceOrders.useUpdate()
  const { serviceOrderActivitiesRefetch } = activities.useActivities()

  const {
    register: rejectRegister,
    formState: { errors: rejectErros },
    handleSubmit: rejectSubmit
  } = useForm({ resolver: yupResolver(rejectSchema) })

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm({ resolver: yupResolver(serviceOrdersSchema) })

  function onSubmit(formData: FormData) {
    updateServiceOrders({
      variables: {
        DataAgendamento: formData.DataAgendamento
      }
    })
      .then(() => {
        serviceOrderRefetch()
        serviceOrderActivitiesRefetch()
        setActiveEdit(false)
        notification('Ordem de serviço agendada com sucesso', 'success')
      })
      .catch((err) => {
        showError(err)
      })
  }

  async function concludeServiceOrderSubmit() {
    await concludeServiceOrder()
      .then(() => {
        serviceOrderRefetch()
        serviceOrderActivitiesRefetch()
        setActiveEdit(false)
        notification('Ordem de serviço concluida com sucesso', 'success')
      })
      .catch((err) => {
        showError(err)
      })
  }

  async function rejectServiceOrderSubmit(formData: {
    MotivoRecusado: string
  }) {
    await rejectServiceOrder({
      variables: {
        MotivoRecusado: formData.MotivoRecusado
      }
    })
      .then(() => {
        serviceOrderRefetch()
        serviceOrderActivitiesRefetch()
        setActiveEdit(false)
        setShowModal(false)
        notification('Ordem de serviço frustrada com sucesso', 'success')
      })
      .catch((err) => {
        showError(err)
      })
  }

  useEffect(() => {
    reset({
      DataAgendamento: serviceOrderData?.DataAgendamento
        ? datetimeFormat(serviceOrderData?.DataAgendamento)
        : undefined
    })
  }, [reset, serviceOrderData])

  return (
    <div className="flex flex-col gap-4">
      <common.Card>
        <div className="flex justify-between">
          <common.GenericTitle
            title="Dados gerais"
            subtitle="Dados básicos da ordem de serviço"
            className="px-6"
          />
          <div className="px-6">
            <common.TitleWithSubTitleAtTheTop
              title={
                serviceOrderData?.Tipo.Comentario +
                ' - ' +
                serviceOrderData?.Situacao.Comentario
              }
              subtitle="Tipo e Situação"
            />
          </div>
        </div>
        <common.Separator className="mb-0" />
        <form>
          <form.FormLine position={1} grid={2}>
            <form.Input
              fieldName="DataAgendamento"
              register={register}
              title="Data de agendamento"
              error={errors.DataAgendamento}
              type="datetime-local"
              disabled={
                !activeEdit || serviceOrderData?.Situacao.Valor === 'concluida'
              }
            />
            <div className="flex items-center justify-end gap-2">
              {activeEdit && (
                <buttons.CancelButton
                  onClick={() => {
                    setActiveEdit(false)
                  }}
                />
              )}
              <buttons.PrimaryButton
                title={activeEdit ? 'Confirmar' : 'Agendar'}
                disabled={
                  updateServiceOrdersLoading ||
                  serviceOrderData?.Situacao.Valor === 'concluida'
                }
                loading={updateServiceOrdersLoading}
                onClick={() => {
                  event?.preventDefault()
                  if (!activeEdit) {
                    setActiveEdit(true)
                    return
                  }
                  handleSubmit(onSubmit)()
                }}
              />
            </div>
          </form.FormLine>

          <div className="flex items-center justify-between w-full px-6">
            <buttons.GoBackButton />
            <div className="flex gap-2">
              <buttons.CancelButton
                onClick={() => setShowModal(true)}
                title="Frustrar"
                disabled={
                  rejectServiceOrderLoading ||
                  serviceOrderData?.Situacao.Valor !== 'agendada'
                }
                loading={rejectServiceOrderLoading}
              />
              <buttons.SecondaryButton
                handler={concludeServiceOrderSubmit}
                title="Concluir"
                disabled={
                  concludeServiceOrderLoading ||
                  serviceOrderData?.Situacao.Valor !== 'agendada'
                }
                loading={concludeServiceOrderLoading}
              />
            </div>
          </div>
          <common.Modal
            handleSubmit={rejectSubmit(rejectServiceOrderSubmit)}
            open={showModal}
            disabled={rejectServiceOrderLoading}
            description="Deseja mesmo frustrar essa ordem de serviço?"
            onClose={() => setShowModal(false)}
            buttonTitle="Frustrar ordem de serviço"
            modalTitle="Frustrar ordem de serviço?"
            color="red"
          >
            <div className="my-2">
              <form.Input
                fieldName="MotivoRecusado"
                title="Motivo da recusa"
                register={rejectRegister}
                error={rejectErros.MotivoRecusado}
              />
            </div>
          </common.Modal>
        </form>
      </common.Card>
    </div>
  )
}
