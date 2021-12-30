export default function Header() {
  return (
    <div className="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
      <button className="mr-2 shadow-md btn btn-primary">
        Adicionar novo registro
      </button>
      <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div className="relative w-56 text-gray-700 dark:text-gray-300">
          {/* <Input label="Pesquise aqui:" /> */}
        </div>
      </div>
    </div>
  )
}
