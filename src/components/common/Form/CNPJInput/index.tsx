import InputMask from 'react-input-mask'
import { Control, Controller } from 'react-hook-form'
import * as form from '@/common/Form'
import {
  DeepMap,
  FieldError,
  FieldValues,
  UseFormRegister
} from 'react-hook-form'
import { ReactNode } from 'react'

type CNPJInputProps = {
  control: Control<FieldValues>
  register: UseFormRegister<FieldValues>
  error?: DeepMap<FieldValues, FieldError>
  className?: string
  disabled?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
} & React.InputHTMLAttributes<HTMLInputElement>

function CNPJInput({
  control,
  error,
  disabled = false,
  ...rest
}: CNPJInputProps) {
  return (
    <Controller
      name="Identificador"
      control={control}
      render={({ field: { onChange } }) => (
        <InputMask
          mask="99.999.999/9999-99"
          placeholder="57.705.074/0001-40"
          onChange={onChange}
          disabled={disabled}
        >
          <form.Input
            fieldName="Identificador"
            title="CNPJ"
            error={error}
            {...rest}
          />
        </InputMask>
      )}
    />
  )
}

export default CNPJInput
