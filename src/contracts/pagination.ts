export interface IPagination {
  page_number: number
  page_size: number
  offSet: number
  authToken: string
  fetchType: string
  streamFetchType: string
}

export interface IUpdateStreamUrlPayload {
  id: string
  link_url: string
  stream_info: string
  fetch_type: string
}

// Pagination response envelope types

export interface IPaginationMeta {
  page_number: number
  page_size: number
  total_items: number
  total_pages: number
  count: number
  has_next: boolean
  has_prev: boolean
  next_page: number | null
  prev_page: number | null
}

export interface IPaginationResponse<T> {
  success: boolean
  data: T[]
  meta: IPaginationMeta
}
