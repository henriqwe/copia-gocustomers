export const ptBRtimeStamp = (item: string | number | Date) => {
  // const result = new Date(item).toLocaleString('pt-BR', { timeZone: 'UTC' })
  const result = new Date(item).toLocaleString('pt-BR')
  return result
}

export const datetimeFormat = (item: string | number | Date) => {
  const result = item.toLocaleString().split('+00:00')[0]
  return result
}

export const capitalizeWord = (text: string) => {
  text = text.toLowerCase()
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export const capitalizeAllWord = (text: string) => {
  return text
    .split(' ')
    .map((word) => capitalizeWord(word))
    .join(' ')
}

export const CNPJFormat = (identifier: string | number) => {
  const string = String(identifier)
  return string.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    '$1.$2.$3/$4-$5'
  )
}

export const CPFFormat = (identifier: string | number) => {
  const string = String(identifier)
  return string.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export const identifierUnformat = (identifier: string | number) => {
  return identifier
    .toString()
    .split('.')
    .join('')
    .split('-')
    .join('')
    .split('/')
    .join('')
}

export const CEPunformat = (identifier: string | number) => {
  return identifier.toString().split('-').join('')
}

export const phoneFormat = (identifier: string | number) => {
  let string = String(identifier)
  string = string.replace(/\D/g, '')
  string = string.replace(/^(\d{2})(\d)/g, '($1) $2')
  string = string.replace(/(\d)(\d{4})$/, '$1-$2')
  return string
}

export const phoneUnformat = (identifier: string | number) => {
  return identifier
    .toString()
    .split('(')
    .join('')
    .split(')')
    .join('')
    .split('-')
    .join('')
    .split(' ')
    .join('')
    .split('_')
    .join('')
}

export const BRLMoneyInputFormat = (e: React.FormEvent<HTMLInputElement>) => {
  let value = e.currentTarget.value
  value = value
    .replace(/\D/g, '')
    .replace(/(\d)(\d{2})$/, '$1,$2')
    .replace(/(?=(\d{3})+(\D))\B/g, '.')

  e.currentTarget.value = value
  return e
}

export const BRLMoneyInputDefaultFormat = (e: string | undefined) => {
  if (e === undefined) {
    return
  }
  let value = e
  value = value
    .toString()
    .replace(/\D/g, '')
    .replace(/(\d)(\d{2})$/, '$1,$2')
    .replace(/(?=(\d{3})+(\D))\B/g, '.')

  e = value
  return e
}

export const BRLMoneyFormat = (value: string | number) => {
  value = value.toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL'
  })
  return value
}

export const BRLMoneyUnformat = (identifier: string | number) => {
  return identifier.toString().split('.').join('').replace(',', '.')
}
