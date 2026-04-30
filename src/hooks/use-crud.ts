import { useState, useCallback, useMemo, type DependencyList } from "react"

export type CrudOperation = "create" | "read" | "update" | "delete" | "list"

export type CrudState<T> = {
  data: T[]
  currentItem: T | null
  loading: boolean
  saving: boolean
  deleting: boolean
  error: string | null
  selectedIds: Set<string | number>
}

export type CrudActions<T> = {
  fetchData: (params?: Record<string, unknown>) => Promise<void>
  createItem: (data: Partial<T>) => Promise<T>
  updateItem: (id: string | number, data: Partial<T>) => Promise<T>
  deleteItem: (id: string | number) => Promise<void>
  deleteMultiple: (ids: (string | number)[]) => Promise<void>
  selectItem: (item: T | null) => void
  toggleSelect: (id: string | number) => void
  selectAll: (ids: (string | number)[]) => void
  clearSelection: () => void
  setError: (error: string | null) => void
  refresh: () => Promise<void>
}

export type UseCrudReturn<T> = CrudState<T> & CrudActions<T>

const defaultState = <T,>(): CrudState<T> => ({
  data: [],
  currentItem: null,
  loading: false,
  saving: false,
  deleting: false,
  error: null,
  selectedIds: new Set(),
})

export function useCrud<T extends Record<string, unknown>>(
  modelName: string,
  options?: {
    initialData?: T[]
    apiEndpoint?: string
    onSuccess?: (operation: CrudOperation, item?: T) => void
    onError?: (error: Error, operation: CrudOperation) => void
    dependencies?: DependencyList
  }
): UseCrudReturn<T> {
  const {
    initialData = [],
    apiEndpoint: customEndpoint,
    onSuccess,
    onError,
    dependencies = [],
  } = options || {}

  const [state, setState] = useState<CrudState<T>>(() => ({
    ...defaultState<T>(),
    data: initialData,
  }))

  const baseEndpoint = customEndpoint || `/api/admin/models/${modelName}`
  const itemEndpoint = (id: string | number) => `${baseEndpoint}/${id}`

  const setLoading = (loading: boolean) =>
    setState((prev) => ({ ...prev, loading }))
  const setSaving = (saving: boolean) =>
    setState((prev) => ({ ...prev, saving }))
  const setDeleting = (deleting: boolean) =>
    setState((prev) => ({ ...prev, deleting }))
  const setError = (error: string | null) =>
    setState((prev) => ({ ...prev, error }))
  const setData = (data: T[]) => setState((prev) => ({ ...prev, data }))
  const setCurrentItem = (item: T | null) =>
    setState((prev) => ({ ...prev, currentItem: item }))
  const setSelectedIds = (selectedIds: Set<string | number>) =>
    setState((prev) => ({ ...prev, selectedIds }))

  const fetchData = useCallback(
    async (params: Record<string, unknown> = {}) => {
      setLoading(true)
      setError(null)

      try {
        const url = new URL(baseEndpoint, window.location.origin)
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value))
          }
        })

        const response = await fetch(url.toString(), {
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch ${modelName}`)
        }

        const payload = await response.json()
        const items = payload.items || payload.results || payload.data || []
        setData(Array.isArray(items) ? items : [])
        onSuccess?.("read")
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch data"
        setError(message)
        onError?.(new Error(message), "read")
      } finally {
        setLoading(false)
      }
    },
    [baseEndpoint, modelName, onSuccess, onError, ...dependencies]
  )

  const createItem = useCallback(
    async (data: Partial<T>): Promise<T> => {
      setSaving(true)
      setError(null)

      try {
        const response = await fetch(baseEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        const payload = await response.json()

        if (!response.ok) {
          throw new Error(payload?.message || "Failed to create item")
        }

        const newItem = payload as T
        setState((prev) => ({
          ...prev,
          data: [newItem, ...prev.data],
        }))
        onSuccess?.("create", newItem)
        return newItem
      } catch (err) {
        const message = err instanceof Error ? err.message : "Create failed"
        setError(message)
        onError?.(new Error(message), "create")
        throw err
      } finally {
        setSaving(false)
      }
    },
    [baseEndpoint, onSuccess, onError, ...dependencies]
  )

  const updateItem = useCallback(
    async (id: string | number, data: Partial<T>): Promise<T> => {
      setSaving(true)
      setError(null)

      try {
        const response = await fetch(itemEndpoint(id), {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        const payload = await response.json()

        if (!response.ok) {
          throw new Error(payload?.message || "Failed to update item")
        }

        const updatedItem = payload as T
        setState((prev) => ({
          ...prev,
          data: prev.data.map((item) =>
            (item.id || item.pk) === id ? updatedItem : item
          ),
          currentItem: prev.currentItem && (prev.currentItem.id || prev.currentItem.pk) === id
            ? updatedItem
            : prev.currentItem,
        }))
        onSuccess?.("update", updatedItem)
        return updatedItem
      } catch (err) {
        const message = err instanceof Error ? err.message : "Update failed"
        setError(message)
        onError?.(new Error(message), "update")
        throw err
      } finally {
        setSaving(false)
      }
    },
    [baseEndpoint, onSuccess, onError, ...dependencies]
  )

  const deleteItem = useCallback(
    async (id: string | number): Promise<void> => {
      setDeleting(true)
      setError(null)

      try {
        const response = await fetch(itemEndpoint(id), {
          method: "DELETE",
        })

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}))
          throw new Error(payload?.message || "Failed to delete item")
        }

        setState((prev) => ({
          ...prev,
          data: prev.data.filter(
            (item) => (item.id || item.pk) !== id
          ),
          selectedIds: new Set(
            [...prev.selectedIds].filter((selectedId) => selectedId !== id)
          ),
        }))
        onSuccess?.("delete")
      } catch (err) {
        const message = err instanceof Error ? err.message : "Delete failed"
        setError(message)
        onError?.(new Error(message), "delete")
        throw err
      } finally {
        setDeleting(false)
      }
    },
    [baseEndpoint, onSuccess, onError, ...dependencies]
  )

  const deleteMultiple = useCallback(
    async (ids: (string | number)[]): Promise<void> => {
      if (ids.length === 0) return

      setDeleting(true)
      setError(null)

      try {
        await Promise.all(
          ids.map((id) =>
            fetch(itemEndpoint(id), { method: "DELETE" })
          )
        )

        setState((prev) => ({
          ...prev,
          data: prev.data.filter(
            (item) => {
              const id = item.id ?? item.pk
              return id === undefined || !ids.includes(id as string | number)
            }
          ),
          selectedIds: new Set(
            [...prev.selectedIds].filter((selectedId) => !ids.includes(selectedId))
          ),
        }))
        onSuccess?.("delete")
      } catch (err) {
        const message = err instanceof Error ? err.message : "Bulk delete failed"
        setError(message)
        onError?.(new Error(message), "delete")
        throw err
      } finally {
        setDeleting(false)
      }
    },
    [baseEndpoint, onSuccess, onError, ...dependencies]
  )

  const selectItem = useCallback((item: T | null) => {
    setCurrentItem(item)
  }, [])

  const toggleSelect = useCallback((id: string | number) => {
    setState((prev) => {
      const newSelection = new Set(prev.selectedIds)
      if (newSelection.has(id)) {
        newSelection.delete(id)
      } else {
        newSelection.add(id)
      }
      return { ...prev, selectedIds: newSelection }
    })
  }, [])

  const selectAll = useCallback((ids: (string | number)[]) => {
    setSelectedIds(new Set(ids))
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  const refresh = useCallback(async () => {
    await fetchData()
  }, [fetchData])

  return useMemo(
    () => ({
      ...state,
      fetchData,
      createItem,
      updateItem,
      deleteItem,
      deleteMultiple,
      selectItem,
      toggleSelect,
      selectAll,
      clearSelection,
      setError,
      refresh,
    }),
    [state, fetchData, createItem, updateItem, deleteItem, deleteMultiple, selectItem, toggleSelect, selectAll, clearSelection, refresh]
  )
}
