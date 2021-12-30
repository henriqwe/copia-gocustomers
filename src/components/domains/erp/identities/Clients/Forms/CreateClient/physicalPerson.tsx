import { UserIcon } from '@heroicons/react/solid'

export function PhysicalPerson() {
  return (
    <div className="inline-flex items-center gap-4">
      <UserIcon className="w-6 h-6" />
      <div className="text-left">
        <p className="text-sm">Pessoa física</p>
        <span className="text-tiny">Será solicitado o cpf</span>
      </div>
    </div>
  )
}
