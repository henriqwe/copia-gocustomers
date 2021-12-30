export default function FieldWithTitleAndSubtitle({
  title,
  subtitle
}: {
  title: string
  subtitle: string
}) {
  return (
    <td>
      <h3 className="font-medium cursor-pointer whitespace-nowrap">{title}</h3>
      <div className="text-gray-600 text-xs whitespace-nowrap mt-0.5">
        {subtitle}
      </div>
    </td>
  )
}
