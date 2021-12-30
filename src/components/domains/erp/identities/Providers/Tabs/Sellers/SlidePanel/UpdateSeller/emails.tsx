import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup/dist/yup'

import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as sellers from '@/domains/erp/identities/Providers/Tabs/Sellers'
import { notification } from 'utils/notification'

export default function Emails() {
  const {
    updateSellerEmail,
    updateSellerEmailLoading,
    sellersRefetch,
    slidePanelState,
    setSlidePanelState,
    emailsSchema
  } = sellers.useSeller()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(emailsSchema)
  })

  const onSubmit = (formData: { Email: string }) => {
    setSlidePanelState((oldState) => {
      return {
        ...oldState,
        data: {
          ...oldState.data,
          Emails: [...oldState.data?.Emails, formData.Email]
        }
      }
    })
    updateSellerEmail({
      variables: {
        Id: slidePanelState.data?.Id,
        Emails: [...slidePanelState.data?.Emails, formData.Email]
      }
    })
      .then(() => {
        sellersRefetch()
        reset({
          Email: ''
        })
        notification(formData.Email + ' cadastrado com sucesso', 'success')
      })
      .catch((err) => {
        notification(err.message, 'error')
      })
  }

  return (
    <form
      data-testid="inserirForm"
      className="flex items-center justify-between gap-2 mb-2"
    >
      <div className="flex-1">
        <form.Input
          fieldName={`Email`}
          register={register}
          title={`E-mail`}
          error={errors.Email}
        />
      </div>
      <buttons.SecondaryButton
        handler={handleSubmit(onSubmit)}
        loading={updateSellerEmailLoading}
        disabled={updateSellerEmailLoading}
        className="w-8 h-full"
      />
    </form>
  )
}
