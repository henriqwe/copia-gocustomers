import { CheckCircleIcon } from '@heroicons/react/solid'

function CheckIcon({ ...props }: React.ComponentProps<'svg'>) {
  return (
    <>
      <CheckCircleIcon
        className={`w-6 h-6 text-primary-11 dark:text-white ${props.className}`}
        {...props}
      />
      {/* <svg viewBox="0 0 24 24" fill="none" {...props}>
        <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
        <path
          d="M7 13l3 3 7-7"
          stroke="#fff"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg> */}
    </>
  )
}

export default CheckIcon
