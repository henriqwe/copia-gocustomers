import Link from '@/common/Link'
import Logo from '@/common/Logo'

export type LogoWithLinkType = {
  url: string
  imageUrl: string
}

export default function LogoWithLink({ url, imageUrl }: LogoWithLinkType) {
  return (
    <Link to={url} className="flex items-center pt-4 pl-5 intro-x">
      <Logo imageUrl={imageUrl} />
    </Link>
  )
}
