import { ReactNode } from 'react'
import {
  DeepMap,
  FieldError,
  FieldValues,
  Path,
  UseFormRegister
} from 'react-hook-form'

type InputType = {
  title?: string
  fieldName: Path<FieldValues>
  register?: UseFormRegister<FieldValues>
  error?: DeepMap<FieldValues, FieldError>
  className?: string
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
} & React.InputHTMLAttributes<HTMLInputElement>

function Input({
  title,
  fieldName,
  register = () => {
    return {
      name: '',
      onBlur: async () => undefined,
      onChange: async () => undefined,
      ref: () => null
    }
  },
  error,
  className,
  icon,
  iconPosition = 'left',
  disabled,
  ...rest
}: InputType) {
  return (
    <div className="relative">
      <div
        className={`flex items-center rounded-md ${
          disabled
            ? 'cursor-not-allowed bg-gray-500 dark:bg-gray-800'
            : 'bg-gray-200 border-gray-300 dark:bg-gray-700'
        }`}
      >
        {icon && iconPosition === 'left' && <p className="ml-2">{icon}</p>}
        <input
          id="fieldId"
          type="text"
          className={`w-full h-10 pl-1 placeholder-transparent peer focus:outline-none focus:border-b-2 focus:border-blue-600 bg-transparent disabled:cursor-not-allowed ml-2 ${
            icon ? (iconPosition === 'left' ? '' : '') : ''
          } ${title ? 'placeholder-shown:pt-0 pt-4 ' : ''} ${className}`}
          disabled={disabled}
          placeholder="john@doe.com"
          {...register(fieldName)}
          {...rest}
        />
        <label
          htmlFor="fieldId"
          className={`absolute text-xs text-gray-600 dark:text-gray-500 transition-all top-1 left-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-700 dark:peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2.5 ${
            disabled ? 'cursor-not-allowed' : ''
          } ${icon ? (iconPosition === 'left' ? 'ml-7' : '') : 'left-3'}`}
        >
          {title}
        </label>
        {icon && iconPosition === 'right' && <p className="mr-2">{icon}</p>}
      </div>
      <p className="mt-1 text-xs text-primary-3">{error && error.message}</p>
    </div>
  )
}

export default Input
