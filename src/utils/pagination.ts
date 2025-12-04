export interface BuildMetaInput {
  total_items: number
  page_number: number
  page_size: number
  count: number
}

export const buildPaginationMeta = ({
  total_items,
  page_number,
  page_size,
  count
}: BuildMetaInput) => {
  const safePageSize = Math.max(1, Number(page_size) || 1)
  const safePageNumber = Math.max(1, Number(page_number) || 1)

  const total_pages =
    total_items > 0 ? Math.max(1, Math.ceil(total_items / safePageSize)) : 0

  const has_prev = safePageNumber > 1 && total_pages >= 1
  const has_next = total_pages > 0 && safePageNumber < total_pages

  const prev_page = has_prev ? safePageNumber - 1 : null
  const next_page = has_next ? safePageNumber + 1 : null

  return {
    page_number: safePageNumber,
    page_size: safePageSize,
    total_items: Math.max(0, Number(total_items) || 0),
    total_pages,
    count: Math.max(0, Number(count) || 0),
    has_next,
    has_prev,
    next_page,
    prev_page
  }
}
