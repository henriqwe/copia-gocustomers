type EmptyLineProps = {
  itensLength: number
}

export default function EmptyLine({ itensLength }: EmptyLineProps) {
  return (
    <tr className="intro-x">
      <td colSpan={itensLength} className="text-center">
        Nenhum registro encontrado!
      </td>
    </tr>
  )
}
