import { render, screen, fireEvent, waitFor, act } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act as hookAct } from "@testing-library/react"
import { useCrud } from "@/hooks/use-crud"

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe("useCrud Hook", () => {
  const modelName = "projects"
  const mockData = [
    { id: "1", name: "Project Alpha", status: "active" },
    { id: "2", name: "Project Beta", status: "pending" },
  ]

  beforeEach(() => {
    mockFetch.mockClear()
    vi.clearAllMocks()
  })

  describe("Initialization", () => {
    it("should initialize with default empty state", () => {
      const { result } = renderHook(() => useCrud(modelName))

      expect(result.current.data).toEqual([])
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
      expect(result.current.selectedIds).toEqual(new Set())
      expect(result.current.currentItem).toBeNull()
    })

    it("should initialize with provided initial data", () => {
      const { result } = renderHook(() =>
        useCrud(modelName, { initialData: mockData })
      )

      expect(result.current.data).toEqual(mockData)
    })
  })

  describe("fetchData", () => {
    it("should fetch data successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: mockData }),
      })

      const { result } = renderHook(() => useCrud(modelName))

      await hookAct(async () => {
        await result.current.fetchData()
      })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/admin/models/${modelName}`),
        expect.objectContaining({
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
        })
      )
      expect(result.current.data).toEqual(mockData)
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it("should handle fetch errors gracefully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: "Server error" }),
      })

      const { result } = renderHook(() => useCrud(modelName))

      await hookAct(async () => {
        await result.current.fetchData()
      })

      expect(result.current.error).toBe("Failed to fetch projects")
      expect(result.current.data).toEqual([])
    })

    it("should support query parameters", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: [mockData[0]] }),
      })

      const { result } = renderHook(() => useCrud(modelName))

      await hookAct(async () => {
        await result.current.fetchData({ status: "active", limit: 10 })
      })

      const calledUrl = mockFetch.mock.calls[0][0] as string
      expect(calledUrl).toContain("status=active")
      expect(calledUrl).toContain("limit=10")
    })
  })

  describe("createItem", () => {
    it("should create a new item and add to data", async () => {
      const newItem = { id: "3", name: "Project Gamma", status: "active" }
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => ({ items: [] }) })
        .mockResolvedValueOnce({ ok: true, json: async () => newItem })

      const { result } = renderHook(() => useCrud(modelName))

      await hookAct(async () => {
        await result.current.fetchData()
      })

      await hookAct(async () => {
        await result.current.createItem({ name: "Project Gamma", status: "active" })
      })

      expect(result.current.data).toHaveLength(1)
      expect(result.current.data[0]).toEqual(newItem)
    })

    it("should handle create errors", async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => ({ items: [] }) })
        .mockResolvedValueOnce({ ok: false, json: async () => ({ message: "Validation failed" }) })

      const { result } = renderHook(() => useCrud(modelName))
      await hookAct(async () => {
        await result.current.fetchData()
      })

      let errorThrown = false
      await hookAct(async () => {
        try {
          await result.current.createItem({ name: "Test" })
        } catch (err) {
          errorThrown = true
        }
      })

      expect(result.current.error).toBe("Validation failed")
      expect(errorThrown).toBe(true)
    })
  })

  describe("updateItem", () => {
    it("should update an existing item", async () => {
      const updatedItem = { ...mockData[0], name: "Updated Alpha" }
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => ({ items: mockData }) })
        .mockResolvedValueOnce({ ok: true, json: async () => updatedItem })

      const { result } = renderHook(() => useCrud(modelName))
      await hookAct(async () => {
        await result.current.fetchData()
      })

      await hookAct(async () => {
        await result.current.updateItem("1", { name: "Updated Alpha" })
      })

      expect(result.current.data[0]).toEqual(updatedItem)
    })
  })

  describe("deleteItem", () => {
    it("should delete an item from the list", async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => ({ items: mockData }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) })

      const { result } = renderHook(() => useCrud(modelName))
      await hookAct(async () => {
        await result.current.fetchData()
      })

      expect(result.current.data).toHaveLength(2)

      await hookAct(async () => {
        await result.current.deleteItem("1")
      })

      expect(result.current.data).toHaveLength(1)
      expect(result.current.data[0].id).toBe("2")
    })

    it("should remove item from selection when deleted", async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => ({ items: mockData }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) })

      const { result } = renderHook(() => useCrud(modelName))
      await hookAct(async () => {
        await result.current.fetchData()
      })

      hookAct(() => {
        result.current.toggleSelect("1")
        result.current.toggleSelect("2")
      })
      expect(result.current.selectedIds.size).toBe(2)

      await hookAct(async () => {
        await result.current.deleteItem("1")
      })

      expect(result.current.selectedIds.size).toBe(1)
      expect(result.current.selectedIds.has("2")).toBe(true)
    })
  })

  describe("Selection Management", () => {
    it("should toggle selection", () => {
      const { result } = renderHook(() => useCrud(modelName, { initialData: mockData }))

      hookAct(() => {
        result.current.toggleSelect("1")
      })
      expect(result.current.selectedIds.has("1")).toBe(true)

      hookAct(() => {
        result.current.toggleSelect("1")
      })
      expect(result.current.selectedIds.has("1")).toBe(false)
    })

    it("should select all", () => {
      const { result } = renderHook(() => useCrud(modelName, { initialData: mockData }))

      hookAct(() => {
        result.current.selectAll(["1", "2"])
      })

      expect(result.current.selectedIds.size).toBe(2)
    })

    it("should clear selection", () => {
      const { result } = renderHook(() => useCrud(modelName, { initialData: mockData }))

      hookAct(() => {
        result.current.selectAll(["1", "2"])
      })
      expect(result.current.selectedIds.size).toBe(2)

      hookAct(() => {
        result.current.clearSelection()
      })
      expect(result.current.selectedIds.size).toBe(0)
    })

    it("should select a single item", () => {
      const { result } = renderHook(() => useCrud(modelName, { initialData: mockData }))

      hookAct(() => {
        result.current.selectItem(mockData[0])
      })

      expect(result.current.currentItem).toEqual(mockData[0])
    })
  })

  describe("refresh", () => {
    it("should reload data", async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => ({ items: mockData }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ items: [mockData[0]] }) })

      const { result } = renderHook(() => useCrud(modelName))

      await hookAct(async () => {
        await result.current.fetchData()
      })
      expect(result.current.data).toHaveLength(2)

      await hookAct(async () => {
        await result.current.refresh()
      })
      expect(result.current.data).toHaveLength(1)
    })
  })

  describe("Response normalization", () => {
    it("should handle 'results' key", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: mockData }),
      })

      const { result } = renderHook(() => useCrud(modelName))

      await hookAct(async () => {
        await result.current.fetchData()
      })

      expect(result.current.data).toEqual(mockData)
    })

    it("should default to empty array for empty response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })

      const { result } = renderHook(() => useCrud(modelName))

      await hookAct(async () => {
        await result.current.fetchData()
      })

      expect(result.current.data).toEqual([])
    })
  })
})
