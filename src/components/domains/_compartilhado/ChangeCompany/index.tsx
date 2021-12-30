import React, { Dispatch, SetStateAction } from 'react'

import * as common from '@/common'

import rotas from '@/domains/routes'
import router from 'next/router'
import companies from '@/domains/companies'

type ChangeCompanyProps = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  empresa: string
  setEmpresa: Dispatch<SetStateAction<string>>
}

const ChangeCompany = ({
  open,
  setOpen,
  empresa,
  setEmpresa
}: ChangeCompanyProps) => (
  <common.DialogueModal open={open} setOpen={setOpen}>
    <common.OptionsGroup companies={companies} setCompanies={setEmpresa} />
    <div className="flex items-center justify-end pl-4 mt-2">
      <button
        onClick={() => {
          if (empresa === 'Comigo Rastreamento') {
            router.push(rotas.erp.home)
          }
          if (empresa === 'Comigo Assistência') {
            router.push(rotas.assistencia.home)
          }
          if (empresa === 'Maxline') {
            router.push(rotas.rastreamento.home)
          }
        }}
        className="px-4 py-3 mt-2 text-white rounded-md bg-theme-10 disabled:cursor-not-allowed disabled:bg-gray-500"
        disabled
      >
        Alterar sistema
      </button>
    </div>
  </common.DialogueModal>
)

export default ChangeCompany
