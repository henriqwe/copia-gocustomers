import { LibraryIcon } from '@heroicons/react/solid'

export function LegalPerson() {
  return (
    <div className="inline-flex items-center gap-4">
      <LibraryIcon className="w-6 h-6" />
      <div className="text-left">
        <p className="text-sm">Pessoa Jurídica</p>
        <span className="text-tiny">Será solicitado o cnpj</span>
      </div>
    </div>
  )
}
