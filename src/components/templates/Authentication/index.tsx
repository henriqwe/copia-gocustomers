import { ReactNode } from 'react'

type AuthenticationProps = {
  leftContent: ReactNode
  rightContent: ReactNode
}

export default function Authentication({
  leftContent,
  rightContent
}: AuthenticationProps) {
  return (
    <div className="container sm:px-10">
      <div className="block grid-cols-2 gap-4 xl:grid">
        {/* <!-- BEGIN: Login Info --> */}
        <div className="flex-col hidden min-h-screen xl:flex">
          <a href="" className="flex items-center pt-5 -intro-x">
            <img
              alt="GoERP"
              className="w-40"
              src="/imagens/logoRastreamento.png"
            />
            {/* <span className="ml-3 text-lg text-white">
              Go<span className="font-medium">ERP</span>
            </span> */}
          </a>
          <div className="my-auto">{leftContent}</div>
        </div>
        {/* <!-- END: Login Info --> */}
        {/* <!-- BEGIN: Login Form --> */}
        <div className="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
          <div className="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-dark-1 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
            {rightContent}
          </div>
        </div>
        {/* <!-- END: Login Form --> */}
      </div>
    </div>
  )
}
