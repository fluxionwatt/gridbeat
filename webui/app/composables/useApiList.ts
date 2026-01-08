// composables/useApiList.ts
import type { UseFetchOptions } from '#app'

export type ApiResp<T> = {
  code: number
  message: string
  data: T
}

export function useApiList<T>(
  url: string,
  opts: UseFetchOptions<ApiResp<T[]>> = {}
) {
  const { data, status, pending, error, refresh } =
    useFetch<ApiResp<T[]>>(url, opts)

  const items = computed(() => data.value?.data ?? [])
  const code = computed(() => data.value?.code ?? null)
  const message = computed(() => data.value?.message ?? '')

  return { data, items, code, message, status, pending, error, refresh }
}