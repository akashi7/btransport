import { CarStatus, ERoles } from '../../../config/constant'
import { baseAPI } from '../api'

export interface WeeklyResponse {
  message: string
  data: Array<WeekInterface>
}

export interface BusesResponse {
  message: string
  data: {
    items: Array<BusesInterface>
    totalItems: number
    itemCount: number
    itemsPerPage: number
    totalPages: number
    currentPage: number
  }
}
export interface DriversResponse {
  message: string
  data: { items: Array<DriverInterface> }
}

export interface DriverInterface {
  id: number
  createdAt: string
  updatedAt: string
  status: string
  userId: number
  user: {
    id: number
    createdAt: string
    updatedAt: string
    isActive: true
    role: string
    email: string
    password: string
    fullName: string
    busStopId: null | number
    zoneId: null | number
  }
}

export interface BusesInterface {
  id: number
  plateNo: string
  zoneId: number
  busStopId: number
  status: CarStatus
  busStop: {
    id: number
    createdAt: string
    updatedAt: string
    busStopName: string
    zoneId: number
  }
  zone: {
    id: number
    createdAt: string
    updatedAt: string
    zoneName: string
    destination: string
  }
}

export interface WeekInterface {
  id: number
  createdAt: string
  updatedAt: string
  startOfWeek: string
  endOfWeek: string
  dayOfWeek: string
  driverId: number
  busId: number
  bus: {
    id: number
    plateNo: string
    zoneId: number
    busStopId: number
  }
  driver: {
    id: number
    createdAt: string
    updatedAt: string
    isActive: boolean
    role: ERoles
    email: string
    password: string
    fullName: string
    busStopId: null | number
    zoneId: null | number
  }
}

export interface PaginationDTO {
  page?: string
  size?: string
}

export interface BusStopInterface {
  id: number
  createdAt: string
  updatedAt: string
  busStopName: string
  zoneId: number
  Bus: Array<BusesInterface>
}

export interface BusStopsResponse {
  message: string
  data: {
    items: Array<BusStopInterface>
    totalItems: number
    itemCount: number
    itemsPerPage: number
    totalPages: number
    currentPage: number
  }
}
export interface ZoneInterface {
  id: number
  createdAt: string
  updatedAt: string
  zoneName: string
  destination: string
  Bus: Array<BusesInterface>
  BusStop: Array<BusStopInterface>
}

export interface ZonesResponse {
  message: string
  data: {
    items: Array<ZoneInterface>
    itemCount: number
    itemsPerPage: number
    currentPage: number
  }
}

export interface BusFormValues {
  plateNo: string
  zoneId: string
  busStopId: string
}

const boxEndpoints = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getWeeklyTimetable: builder.query<WeeklyResponse, void>({
      providesTags: ['Reports'],
      query: () => ({
        url: `/weekly/get-timetable`,
        method: 'GET',
      }),
    }),

    getAllBuses: builder.query<BusesResponse, PaginationDTO>({
      providesTags: ['Buses'],
      query: ({ page = '', size = '' }) => ({
        url: `/buses/get-buses?page=${page}&size=${size}`,
        method: 'GET',
      }),
    }),
    getAllDrivers: builder.query<DriversResponse, void>({
      providesTags: ['Driver'],
      query: () => ({
        url: `/driver/get-driver`,
        method: 'GET',
      }),
    }),
    getBusStops: builder.query<BusStopsResponse, PaginationDTO>({
      providesTags: ['BusStop'],
      query: ({ page = '', size = '' }) => ({
        url: `/busStop/get-busStop?page=${page}&size=${size}`,
        method: 'GET',
      }),
    }),
    getZones: builder.query<ZonesResponse, PaginationDTO>({
      providesTags: ['Zones'],
      query: ({ page = '', size = '' }) => ({
        url: `/zone/get-zone?page=${page}&size=${size}`,
        method: 'GET',
      }),
    }),
    registerBus: builder.mutation<unknown, BusFormValues>({
      invalidatesTags: ['Buses'],
      query: (DTO) => ({
        url: `/buses/create-buses`,
        method: 'POST',
        body: DTO,
      }),
    }),
  }),
})

export const {
  useGetWeeklyTimetableQuery,
  useGetAllBusesQuery,
  useGetAllDriversQuery,
  useGetBusStopsQuery,
  useGetZonesQuery,
  useRegisterBusMutation,
} = boxEndpoints
