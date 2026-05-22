
export interface FilterState {
  search: string
  genre: string
  year: string
  season: string
  format: string
  status: string
}

export const defaultFilters: FilterState = {
  search: '',
  genre: '',
  year: '',
  season: '',
  format: '',
  status: '',
}