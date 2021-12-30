import * as common from '@/common'
import * as activities from '@/domains/erp/operational/ServiceOrders/Tabs/Activities'
import { ptBRtimeStamp } from 'utils/formaters'
export default function List() {
  const { serviceOrderActivitiesData } = activities.useActivities()
  return serviceOrderActivitiesData ? (
    <div className="relative mt-5 report-timeline">
      {serviceOrderActivitiesData.map((activity) => (
        <common.ActivityCard
          key={activity.Id}
          title={`Nome da Pessoa`}
          date={ptBRtimeStamp(activity.created_at)}
          description={
            <div>
              <p>Situação: {activity.Situacao.Comentario}</p>
              {activity.MotivoRecusado ? (
                <p>Motivo da recusa: {activity.MotivoRecusado}</p>
              ) : null}
            </div>
          }
        />
      ))}
    </div>
  ) : (
    <common.EmptyContent />
  )
}
