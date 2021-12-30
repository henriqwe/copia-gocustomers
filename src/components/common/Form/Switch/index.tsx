import { Switch as SwitchHeadLess } from '@headlessui/react'

type SwitchProps = {
  value: boolean
  onChange: () => void
  alt?: string
  size?: 'big' | 'medium' | 'small'
}

export default function Switch({
  value,
  onChange,
  alt = 'switch',
  size = 'big'
}: SwitchProps) {
  let switchListWidth
  let switchListHeight
  let switchButtonWidth
  let switchButtonHeight
  let translateX
  switch (size) {
    case 'big':
      switchListWidth = 'w-14'
      switchListHeight = 'h-8'
      switchButtonWidth = 'w-8'
      switchButtonHeight = 'h-8'
      translateX = 'translate-x-7'
      break
    case 'medium':
      switchListWidth = 'w-12'
      switchListHeight = 'h-7'
      switchButtonWidth = 'w-7'
      switchButtonHeight = 'h-7'
      translateX = 'translate-x-5'
      break
    case 'small':
      switchListWidth = 'w-8'
      switchListHeight = 'h-5'
      switchButtonWidth = 'w-5'
      switchButtonHeight = 'h-5'
      translateX = 'translate-x-3'
      break
  }
  return (
    <SwitchHeadLess
      checked={value}
      onChange={onChange}
      className={`${value ? 'bg-theme-9' : 'bg-gray-400'}
relative inline-flex flex-shrink-0 ${switchListHeight} ${switchListWidth} border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 items-center`}
    >
      <span className="sr-only">{alt}</span>
      <span
        aria-hidden="true"
        className={`${value ? translateX : 'translate-x-0'}
pointer-events-none inline-block ${switchButtonHeight} ${switchButtonWidth} rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
      />
    </SwitchHeadLess>
  )
}
