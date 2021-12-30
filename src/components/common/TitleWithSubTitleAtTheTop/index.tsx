type TitleWithSubTitleAtTheTopProps = {
  title: string
  subtitle: string
}

function TitleWithSubTitleAtTheTop({
  title,
  subtitle
}: TitleWithSubTitleAtTheTopProps) {
  return (
    <div>
      <p className="-mb-2 text-gray-500 text-tiny">{subtitle}:</p>
      <h1 className="mb-1 text-lg dark:text-white">{title}</h1>
    </div>
  )
}

export default TitleWithSubTitleAtTheTop
