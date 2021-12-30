import * as common from '@/common'
import router from 'next/router'
import { useState } from 'react'

type ActionsRowProps = {
  actions: AcoesProps[]
}

type AcoesProps = {
  title: string
  url?: string

  handler?: any
  icon: JSX.Element
}

type ModalStateType = {
  opened: boolean
  data: AcoesProps | null
  disable: boolean
}

export default function ActionsRow({ actions }: ActionsRowProps) {
  const [modalState, setModalState] = useState<ModalStateType>({
    opened: false,
    data: null,
    disable: false
  })
  return (
    <td className=" table-report__action">
      <div
        className="flex items-center justify-center gap-2"
        data-testid="ações"
      >
        {actions.map((item, index) => (
          <p
            key={`actions-row-${index}`}
            className="flex items-center cursor-pointer text-theme-6"
            onClick={() => {
              if (item.url) {
                router.push(item.url)
                return
              }
              if (item.title === 'Deletar') {
                setModalState({
                  opened: true,
                  data: item,
                  disable: false
                })
                return
              }
              item.handler()
            }}
            data-testid="button"
          >
            {item.icon}
          </p>
        ))}
      </div>
      <common.Modal
        onClose={() => {
          setModalState({
            ...modalState,
            opened: false
          })
        }}
        open={modalState.opened}
        buttonTitle={modalState.data?.title as string}
        modalTitle={`Quer realmente deletar?`}
        description="Essa ação não podera ser desfeita!"
        handleSubmit={() => {
          setModalState({
            ...modalState,
            opened: true,
            disable: true
          })
          modalState.data?.handler().then(() => {
            setModalState({
              ...modalState,
              opened: false,
              disable: false
            })
          })
        }}
        disabled={modalState.disable}
        color="red"
      />
    </td>
  )
}
