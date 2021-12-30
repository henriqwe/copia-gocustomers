import rotas from '@/domains/routes'
import Base from '@/templates/Base'

// import FullCalendar from '@fullcalendar/react'
// import interactionPlugin from '@fullcalendar/interaction'
// import timeGridPlugin from '@fullcalendar/timegrid'

import dynamic from 'next/dynamic'

export default function Calendario() {
  return <Page />
}

export function Page() {
  const FullCalendar = dynamic(
    () => import('../../components/blocks/Calendar'),
    {
      ssr: false
    }
  )
  return (
    <Base
      title="Calendário 1"
      noGrid={true}
      currentLocation={[
        { title: 'Rastreamento', url: rotas.erp.home },
        { title: 'Canlendário', url: rotas.erp.comercial.index }
      ]}
    >
      <>
        <div className="grid grid-cols-12 gap-5 mt-5">
          <div className="col-span-12 xl:col-span-4 2xl:col-span-3">
            <div className="box p-5 intro-y">
              <button type="button" className="btn btn-primary w-full mt-2">
                <i className="w-4 h-4 mr-2" data-feather="edit-3"></i> Agendar
              </button>
              <div
                className="border-t border-b border-gray-200 dark:border-dark-5 mt-6 mb-5 py-3"
                id="calendar-events"
              >
                <div className="relative">
                  <div className="event p-3 -mx-3 cursor-pointer transition duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-dark-1 rounded-md flex items-center">
                    <div className="w-2 h-2 bg-theme-11 rounded-full mr-3"></div>
                    <div className="pr-10">
                      <div className="event__title truncate">OS 001</div>
                      <div className="text-gray-600 text-xs mt-0.5">
                        <span className="event__days">2</span> Dias{' '}
                        <span className="mx-1">•</span> 10:00 AM
                      </div>
                    </div>
                  </div>
                  <a
                    className="flex items-center absolute top-0 bottom-0 my-auto right-0"
                    href=""
                  >
                    {' '}
                    <i
                      data-feather="edit"
                      className="w-4 h-4 text-gray-600"
                    ></i>{' '}
                  </a>
                </div>
                <div className="relative">
                  <div className="event p-3 -mx-3 cursor-pointer transition duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-dark-1 rounded-md flex items-center">
                    <div className="w-2 h-2 bg-theme-12 rounded-full mr-3"></div>
                    <div className="pr-10">
                      <div className="event__title truncate">OS 002</div>
                      <div className="text-gray-600 text-xs mt-0.5">
                        <span className="event__days">3</span> Dias{' '}
                        <span className="mx-1">•</span> 07:00 AM
                      </div>
                    </div>
                  </div>
                  <a
                    className="flex items-center absolute top-0 bottom-0 my-auto right-0"
                    href=""
                  >
                    {' '}
                    <i
                      data-feather="edit"
                      className="w-4 h-4 text-gray-600"
                    ></i>{' '}
                  </a>
                </div>
                <div className="relative">
                  <div className="event p-3 -mx-3 cursor-pointer transition duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-dark-1 rounded-md flex items-center">
                    <div className="w-2 h-2 bg-theme-11 rounded-full mr-3"></div>
                    <div className="pr-10">
                      <div className="event__title truncate">OS 003</div>
                      <div className="text-gray-600 text-xs mt-0.5">
                        <span className="event__days">4</span> Dias{' '}
                        <span className="mx-1">•</span> 11:00 AM
                      </div>
                    </div>
                  </div>
                  <a
                    className="flex items-center absolute top-0 bottom-0 my-auto right-0"
                    href=""
                  >
                    {' '}
                    <i
                      data-feather="edit"
                      className="w-4 h-4 text-gray-600"
                    ></i>{' '}
                  </a>
                </div>
                <div
                  className="text-gray-600 p-3 text-center hidden"
                  id="calendar-no-events"
                >
                  Sem agendamnetos
                </div>
              </div>
              {/*<div className="form-check">*/}
              {/*  <label className="form-check-label" htmlFor="checkbox-events">*/}
              {/*    Remover após dropar*/}
              {/*  </label>*/}
              {/*  <input*/}
              {/*    className="show-code form-check-switch ml-auto"*/}
              {/*    type="checkbox"*/}
              {/*    id="checkbox-events"*/}
              {/*  />*/}
              {/*</div>*/}
            </div>
            <div className="box p-5 intro-y mt-5">
              <div className="flex">
                <i
                  data-feather="chevron-left"
                  className="w-5 h-5 text-gray-600"
                ></i>
                <div className="font-medium text-base mx-auto">Abril</div>
                <i
                  data-feather="chevron-right"
                  className="w-5 h-5 text-gray-600"
                ></i>
              </div>
              <div className="grid grid-cols-7 gap-4 mt-5 text-center">
                <div className="font-medium">Su</div>
                <div className="font-medium">Mo</div>
                <div className="font-medium">Tu</div>
                <div className="font-medium">We</div>
                <div className="font-medium">Th</div>
                <div className="font-medium">Fr</div>
                <div className="font-medium">Sa</div>
                <div className="py-0.5 rounded relative text-gray-600">29</div>
                <div className="py-0.5 rounded relative text-gray-600">30</div>
                <div className="py-0.5 rounded relative text-gray-600">31</div>
                <div className="py-0.5 rounded relative">1</div>
                <div className="py-0.5 rounded relative">2</div>
                <div className="py-0.5 rounded relative">3</div>
                <div className="py-0.5 rounded relative">4</div>
                <div className="py-0.5 rounded relative">5</div>
                <div className="py-0.5 bg-theme-18 dark:bg-theme-9 rounded relative">
                  6
                </div>
                <div className="py-0.5 rounded relative">7</div>
                <div className="py-0.5 bg-theme-1 dark:bg-theme-1 text-white rounded relative">
                  8
                </div>
                <div className="py-0.5 rounded relative">9</div>
                <div className="py-0.5 rounded relative">10</div>
                <div className="py-0.5 rounded relative">11</div>
                <div className="py-0.5 rounded relative">12</div>
                <div className="py-0.5 rounded relative">13</div>
                <div className="py-0.5 rounded relative">14</div>
                <div className="py-0.5 rounded relative">15</div>
                <div className="py-0.5 rounded relative">16</div>
                <div className="py-0.5 rounded relative">17</div>
                <div className="py-0.5 rounded relative">18</div>
                <div className="py-0.5 rounded relative">19</div>
                <div className="py-0.5 rounded relative">20</div>
                <div className="py-0.5 rounded relative">21</div>
                <div className="py-0.5 rounded relative">22</div>
                <div className="py-0.5 bg-theme-17 dark:bg-theme-11 rounded relative">
                  23
                </div>
                <div className="py-0.5 rounded relative">24</div>
                <div className="py-0.5 rounded relative">25</div>
                <div className="py-0.5 rounded relative">26</div>
                <div className="py-0.5 bg-theme-14 dark:bg-theme-12 rounded relative">
                  27
                </div>
                <div className="py-0.5 rounded relative">28</div>
                <div className="py-0.5 rounded relative">29</div>
                <div className="py-0.5 rounded relative">30</div>
                <div className="py-0.5 rounded relative text-gray-600">1</div>
                <div className="py-0.5 rounded relative text-gray-600">2</div>
                <div className="py-0.5 rounded relative text-gray-600">3</div>
                <div className="py-0.5 rounded relative text-gray-600">4</div>
                <div className="py-0.5 rounded relative text-gray-600">5</div>
                <div className="py-0.5 rounded relative text-gray-600">6</div>
                <div className="py-0.5 rounded relative text-gray-600">7</div>
                <div className="py-0.5 rounded relative text-gray-600">8</div>
                <div className="py-0.5 rounded relative text-gray-600">9</div>
              </div>
              <div className="border-t border-gray-200 dark:border-dark-5 pt-5 mt-5">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-theme-11 rounded-full mr-3"></div>
                  <span className="truncate">Dia da independência</span>
                  <div className="h-px flex-1 border border-r border-dashed border-gray-300 mx-3 xl:hidden"></div>
                  <span className="font-medium xl:ml-auto">23th</span>
                </div>
                <div className="flex items-center mt-4">
                  <div className="w-2 h-2 bg-theme-1 dark:bg-theme-10 rounded-full mr-3"></div>
                  <span className="truncate">Dia do memorial</span>
                  <div className="h-px flex-1 border border-r border-dashed border-gray-300 mx-3 xl:hidden"></div>
                  <span className="font-medium xl:ml-auto">10th</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 xl:col-span-8 2xl:col-span-9">
            <div className="box p-5">
              <div className="full-calendar" id="calendar">
                <FullCalendar />
              </div>
            </div>
          </div>
        </div>
      </>
    </Base>
  )
}
