import * as common from '@/common'
import * as form from '@/common/Form'
import Skeleton from 'react-loading-skeleton'

const ViewVehicle = () => {
  return (
    <common.Card className="mb-1">
      <div className="flex">
        <div className="w-2/5">
          <common.GenericTitle
            title={
              <div className="min-w-full">
                <Skeleton
                  baseColor="rgb(235, 235, 235)"
                  highlightColor="rgb(162, 170, 180)"
                  width="50%"
                />
                <Skeleton
                  baseColor="rgb(235, 235, 235)"
                  highlightColor="rgb(162, 170, 180)"
                  width="75%"
                />
              </div>
            }
            subtitle={
              <Skeleton
                baseColor="rgb(113, 128, 150)"
                highlightColor="rgb(162, 170, 180)"
              />
            }
            className="px-6"
          />
          <div className="px-6 mt-2">
            <Skeleton
              baseColor="rgb(235, 235, 235)"
              highlightColor="rgb(162, 170, 180)"
              width="50%"
              height={28}
            />
          </div>
        </div>
        <div className="flex items-start justify-center w-3/5 gap-4">
          <div>
            <Skeleton
              baseColor="#6E961D"
              highlightColor="rgb(165, 228, 19)"
              height={36}
              width={125}
            />
          </div>
          <div className="flex-1">
            <Skeleton
              baseColor="rgb(74, 85, 104)"
              highlightColor="rgb(162, 170, 180)"
              height={40}
            />
            <Skeleton
              baseColor="rgb(199, 210, 255)"
              highlightColor="rgb(162, 170, 180)"
              width="30%"
            />
          </div>

          <div className="mr-6">
            <Skeleton
              baseColor="#6E961D"
              highlightColor="rgb(165, 228, 19)"
              height={40}
              width={48}
            />
          </div>
        </div>
      </div>
      <common.Separator />
      {[1, 2, 3].map((_, index) => (
        <form.FormLine position={index} grid={1} key={index}>
          <div className="grid grid-cols-9 gap-4">
            <div className="col-span-3">
              <Skeleton
                baseColor="rgb(45, 55, 72)"
                highlightColor="#888888"
                height={40}
              />
            </div>

            <div className="col-span-3">
              <Skeleton
                baseColor="rgb(45, 55, 72)"
                highlightColor="#888888"
                height={40}
              />
            </div>

            <div className="col-span-2">
              <Skeleton
                baseColor="rgb(45, 55, 72)"
                highlightColor="#888888"
                height={40}
              />
            </div>

            <div>
              <Skeleton
                baseColor="rgb(211, 41, 41)"
                highlightColor="rgb(209, 87, 87)"
                height={40}
                width={40}
              />
            </div>
          </div>
          <div>
            <Skeleton
              baseColor="rgb(235, 235, 235)"
              highlightColor="rgb(123, 130, 138)"
              width="25%"
            />
          </div>
        </form.FormLine>
      ))}
      <div className="flex items-center justify-between w-full px-6 mt-4">
        <div>
          <Skeleton
            baseColor="rgb(160, 174, 192)"
            highlightColor="rgb(123, 130, 138)"
            height={36}
          />
          <p className="px-3 py-2 opacity-0">Voltar</p>
        </div>
        <div>
          <Skeleton
            baseColor="rgb(28, 63, 170)"
            highlightColor="rgb(58, 86, 168)"
            height={36}
          />
          <p className="px-3 py-2 opacity-0">Enviar</p>
        </div>
      </div>
    </common.Card>
  )
}

export default ViewVehicle
