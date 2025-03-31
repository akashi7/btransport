import { CarStatus, ERoles } from '../../../config/constant'
import { baseAPI } from '../api'

export interface WeeklyResponse {
  message: string
  data: Array<WeekInterface>
}
export interface BusStopFormValues {
  busStopName: string
  zoneId: string
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

export interface ManagerInterface {
  id: number
  createdAt: string
  updatedAt: string
  userId: number
  user: {
    id: number
    createdAt: string
    updatedAt: string
    isActive: boolean
    role: string
    email: string
    password: string
    fullName: string
    busStopId: number | null
    zoneId: number | null
  }
}

export interface ManagersResponse {
  message: string
  data: Array<ManagerInterface>
}

export interface ZoneFormValues {
  zoneName: string
  destination: string
  managerId: number
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

export type DriverStatus = 'AVAILABLE' | 'NOT_AVAILABLE' | 'ON_DUTY';

export interface DriverFormValues {
  email: string;
  fullName: string;
  password: string;
  status: DriverStatus;
  role?: string;
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
    deleteBus: builder.mutation<unknown, number>({
      invalidatesTags: ['Buses'],
      query: (id) => ({
        url: `/buses/${id}/delete-buses`,
        method: 'DELETE',
      }),
    }),
    
    updateBus: builder.mutation<unknown, {id: number, data: BusFormValues}>({
      invalidatesTags: ['Buses'],
      query: ({id, data}) => ({
        url: `/buses/${id}/update-buses`,
        method: 'PUT',
        body: data,
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
    getAllManagers: builder.query<ManagersResponse, void>({
      providesTags: ['Manager'],
      query: () => ({
        url: `/admin/managers`,
        method: 'GET',
      }),
    }),
    
    registerZone: builder.mutation<unknown, ZoneFormValues>({
      invalidatesTags: ['Zones'],
      query: (DTO) => ({
        url: `/zone/create-zone`,
        method: 'POST',
        body: DTO,
      }),
    }),
    deleteZone: builder.mutation<unknown, number>({
      invalidatesTags: ['Zones'],
      query: (id) => ({
        url: `/zone/${id}/delete-zone`, 
        method: 'DELETE',
      }),
    }),
    updateZone: builder.mutation<unknown, {id: number, data: ZoneFormValues}>({
      invalidatesTags: ['Zones'],
      query: ({id, data}) => ({
        url: `/zone/${id}/update-zone`,
        method: 'PUT',
        body: data,
      }),
    }),
    registerDriver: builder.mutation<unknown, DriverFormValues>({
      invalidatesTags: ['Driver'],
      query: (DTO) => ({
        url: `/driver/create-driver`,
        method: 'POST',
        body: DTO,
      }),
    }),
    
    updateDriver: builder.mutation<unknown, {id: number, data: Partial<DriverFormValues>}>({
      invalidatesTags: ['Driver'],
      query: ({id, data}) => ({
        url: `/driver/${id}/update-driver`,
        method: 'PUT',
        body: data,
      }),
    }),
    
    deleteDriver: builder.mutation<unknown, number>({
      invalidatesTags: ['Driver'],
      query: (id) => ({
        url: `/driver/${id}/delete-driver`,
        method: 'DELETE',
      }),
    }),
registerBusStop: builder.mutation<unknown, BusStopFormValues>({
  invalidatesTags: ['BusStop'],
  query: (DTO) => ({
    url: `/busStop/create-busStop`,
    method: 'POST',
    body: DTO,
  }),
}),

updateBusStop: builder.mutation<unknown, {id: number, data: BusStopFormValues}>({
  invalidatesTags: ['BusStop'],
  query: ({id, data}) => ({
    url: `/busStop/${id}/update-busStop`,
    method: 'PUT',
    body: data,
  }),
}),

deleteBusStop: builder.mutation<unknown, number>({
  invalidatesTags: ['BusStop'],
  query: (id) => ({
    url: `/busStop/${id}/delete-busStop`,
    method: 'DELETE',
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
  useGetAllManagersQuery,  
  useRegisterZoneMutation, 
  useDeleteZoneMutation, 
  useUpdateZoneMutation, 
  useRegisterDriverMutation, 
  useUpdateDriverMutation,    
  useDeleteDriverMutation,
  useRegisterBusStopMutation,  
  useUpdateBusStopMutation,   
  useDeleteBusStopMutation, 
  useDeleteBusMutation,    
  useUpdateBusMutation, 
} = boxEndpoints
