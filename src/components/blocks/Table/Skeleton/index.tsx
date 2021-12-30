import Skeleton from 'react-loading-skeleton'

export default function TableSkeleton() {
  return (
    <div className="mt-4">
      <div className="flex justify-end w-full gap-4 mb-2">
        <div className="w-1/2">
          <Skeleton
            baseColor="rgb(74, 85, 104)"
            highlightColor="rgb(162, 170, 180)"
            height={40}
          />
        </div>
        <Skeleton
          baseColor="#6E961D"
          highlightColor="rgb(165, 228, 19)"
          height={40}
          width={48}
        />
      </div>
      <Skeleton
        baseColor="rgb(43, 51, 72)"
        highlightColor="rgb(63, 72, 101)"
        className="mb-2"
        height={30}
      />
      <Skeleton
        baseColor="rgb(49, 58, 85)"
        highlightColor="rgb(63, 72, 101)"
        className="mb-2"
        height={44}
      />
      <div className="flex justify-between">
        <Skeleton
          baseColor="rgb(49, 58, 85)"
          highlightColor="rgb(63, 72, 101)"
          className="mb-2"
          height={38}
          width={40}
        />

        <div className="ml-24 w-60">
          <Skeleton
            baseColor="rgb(113, 128, 150)"
            highlightColor="rgb(87, 99, 117)"
            className="mx-auto mb-2"
          />
        </div>

        <Skeleton
          baseColor="rgb(49, 58, 85)"
          highlightColor="rgb(63, 72, 101)"
          className="mb-2"
          height={38}
          width={80}
        />
      </div>
    </div>
  )
}
