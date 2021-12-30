import NextLink from 'next/link'
import React from 'react'

interface IProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  // allow both static and dynamic routes
  to: string | { href: string; as: string }
  prefetch?: boolean
}

export default function Link({ to, prefetch, ...props }: IProps) {
  if (typeof to === 'string') {
    return (
      <NextLink href={to} prefetch={prefetch || false}>
        <a {...props} />
      </NextLink>
    )
  }

  return (
    <NextLink href={to.href} as={to.as} prefetch={prefetch || false}>
      <a {...props} />
    </NextLink>
  )
}
