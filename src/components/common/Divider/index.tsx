export default function Divider({
  className = 'my-6'
}: {
  className?: string
}) {
  return <div className={`z-10 side-nav__devider ${className}`} />
}
