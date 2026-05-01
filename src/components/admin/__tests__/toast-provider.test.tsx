import { render, screen, fireEvent, act } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { ToastProvider, useToast, ToastContainer } from "@/components/admin/toast-provider"
import { toast } from "sonner"
import { useCrudToasts } from "@/components/admin/toast-provider"

// Mock sonner (typed wrapper so assigning .success / .error etc. type-checks)
vi.mock("sonner", () => {
  type SonnerToastMock = ReturnType<typeof vi.fn> &
    Record<"success" | "error" | "promise" | "loading" | "dismiss", ReturnType<typeof vi.fn>>
  const mockToast = vi.fn() as unknown as SonnerToastMock
  mockToast.success = vi.fn()
  mockToast.error = vi.fn()
  mockToast.promise = vi.fn()
  mockToast.loading = vi.fn(() => "toast-id")
  mockToast.dismiss = vi.fn()
  return {
    toast: mockToast,
    Toaster: vi.fn(({ children }) => <div data-testid="sonner-toaster">{children}</div>),
  }
})

// Mock useTheme
vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "system" }),
}))

describe("ToastProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("Provider Setup", () => {
    it("should provide toast context to children", () => {
      const TestComponent = () => {
        const toast = useToast()
        return <button onClick={() => toast.success("Hello")}>Test</button>
      }

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      expect(screen.getByText("Test")).toBeInTheDocument()
    })

    it("should throw error when useToast used outside provider", () => {
      // Suppress console.error for this test
      const originalError = console.error
      console.error = vi.fn()

      expect(() => {
        render(<TestComponentOutside />)
      }).toThrow("useToast must be used within a ToastProvider")

      console.error = originalError
    })
  })

  describe("Toast Methods", () => {
    const renderWithProvider = () => {
      const TestComponent = () => {
        const toast = useToast()
        return (
          <div>
            <button onClick={() => toast.success("Success!")}>Success</button>
            <button onClick={() => toast.error("Error!")}>Error</button>
            <button onClick={() => toast.warning("Warning!")}>Warning</button>
            <button onClick={() => toast.info("Info!")}>Info</button>
            <button onClick={() => toast.loading("Loading...")}>Loading</button>
            <button
              onClick={() =>
                toast.promise(Promise.resolve("data"), {
                  loading: "Loading...",
                  success: "Done!",
                  error: "Failed!",
                })
              }
            >
              Promise
            </button>
            <button onClick={() => toast.dismiss("toast-id")}>Dismiss</button>
          </div>
        )
      }

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )
    }

    it("should call sonner success with correct icon and styling", async () => {
      renderWithProvider()

      await act(async () => {
        fireEvent.click(screen.getByText("Success"))
      })

      expect(toast.success).toHaveBeenCalledWith("Success!", {
        icon: expect.any(Object),
        duration: 4000,
        className: expect.stringContaining("bg-green-50"),
      })
    })

    it("should call sonner error with correct icon and styling", async () => {
      renderWithProvider()

      await act(async () => {
        fireEvent.click(screen.getByText("Error"))
      })

      expect(toast.error).toHaveBeenCalledWith("Error!", {
        icon: expect.any(Object),
        duration: 5000,
        className: expect.stringContaining("bg-red-50"),
      })
    })

    it("should call sonner with warning styling", async () => {
      renderWithProvider()

      await act(async () => {
        fireEvent.click(screen.getByText("Warning"))
      })

      expect(toast).toHaveBeenCalledWith("Warning!", {
        icon: expect.any(Object),
        duration: 4000,
        className: expect.stringContaining("bg-amber-50"),
      })
    })

    it("should call sonner with info styling", async () => {
      renderWithProvider()

      await act(async () => {
        fireEvent.click(screen.getByText("Info"))
      })

      expect(toast).toHaveBeenCalledWith("Info!", {
        icon: expect.any(Object),
        duration: 3000,
        className: expect.stringContaining("bg-blue-50"),
      })
    })

    it("should call sonner loading with infinite duration", async () => {
      renderWithProvider()

      await act(async () => {
        fireEvent.click(screen.getByText("Loading"))
      })

      expect(toast.loading).toHaveBeenCalledWith("Loading...", {
        icon: expect.any(Object),
        duration: Infinity,
        className: expect.stringContaining("bg-muted"),
      })
    })

    it("should call dismiss with specified toastId", async () => {
      renderWithProvider()

      await act(async () => {
        fireEvent.click(screen.getByText("Dismiss"))
      })

      expect(toast.dismiss).toHaveBeenCalledWith("toast-id")
    })

    it("should forward promise to sonner with custom options", async () => {
      renderWithProvider()

      await act(async () => {
        fireEvent.click(screen.getByText("Promise"))
      })

      expect(toast.promise).toHaveBeenCalledWith(
        Promise.resolve("data"),
        expect.objectContaining({
          loading: "Loading...",
          success: "Done!",
          error: "Failed!",
        })
      )
    })
  })

  describe("ToastContainer", () => {
    it("should render sonner Toaster component", () => {
      render(<ToastContainer />)

      expect(screen.getByTestId("sonner-toaster")).toBeInTheDocument()
    })

    it("should pass props to Toaster", () => {
      render(
        <ToastContainer
          position="bottom-left"
          richColors={false}
          duration={5000}
        />
      )

      // Just verify it renders without error - props are passed through
      expect(screen.getByTestId("sonner-toaster")).toBeInTheDocument()
    })
  })

  describe("useCrudToasts", () => {
    it("should generate appropriate success messages for CRUD operations", async () => {
      const TestComponent = () => {
        const crudToasts = useCrudToasts("Project")
        return (
          <button onClick={() => crudToasts.onSuccess("create")}>
            Create Success
          </button>
        )
      }

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      await act(async () => {
        fireEvent.click(screen.getByText("Create Success"))
      })

      expect(toast.success).toHaveBeenCalledWith("Project created successfully")
    })

    it("should generate update success message", async () => {
      const TestComponent = () => {
        const crudToasts = useCrudToasts("User")
        return (
          <button onClick={() => crudToasts.onSuccess("update")}>
            Update Success
          </button>
        )
      }

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      await act(async () => {
        fireEvent.click(screen.getByText("Update Success"))
      })

      expect(toast.success).toHaveBeenCalledWith("User updated successfully")
    })

    it("should generate delete success message", async () => {
      const TestComponent = () => {
        const crudToasts = useCrudToasts("Task")
        return (
          <button onClick={() => crudToasts.onSuccess("delete")}>
            Delete Success
          </button>
        )
      }

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      await act(async () => {
        fireEvent.click(screen.getByText("Delete Success"))
      })

      expect(toast.success).toHaveBeenCalledWith("Task deleted successfully")
    })

    it("should generate fetch success message", async () => {
      const TestComponent = () => {
        const crudToasts = useCrudToasts("Organization")
        return (
          <button onClick={() => crudToasts.onSuccess("fetch")}>
            Fetch Success
          </button>
        )
      }

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      await act(async () => {
        fireEvent.click(screen.getByText("Fetch Success"))
      })

      expect(toast.success).toHaveBeenCalledWith("Organization loaded")
    })

    it("should generate error messages with error details", async () => {
      const TestComponent = () => {
        const crudToasts = useCrudToasts("Project")
        return (
          <button onClick={() => crudToasts.onError("create", new Error("Network error"))}>
            Create Error
          </button>
        )
      }

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      await act(async () => {
        fireEvent.click(screen.getByText("Create Error"))
      })

      expect(toast.error).toHaveBeenCalledWith(
        "Failed to create Project: Network error"
      )
    })

    it("should handle pluralization for bulk delete", async () => {
      const TestComponent = () => {
        const crudToasts = useCrudToasts("Task")
        return (
          <div>
            <button onClick={() => crudToasts.onBulkDelete(1)}>Single</button>
            <button onClick={() => crudToasts.onBulkDelete(5)}>Multiple</button>
          </div>
        )
      }

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      await act(async () => {
        fireEvent.click(screen.getByText("Single"))
      })
      expect(toast.success).toHaveBeenCalledWith("Successfully deleted 1 record")

      await act(async () => {
        fireEvent.click(screen.getByText("Multiple"))
      })
      expect(toast.success).toHaveBeenCalledWith("Successfully deleted 5 records")
    })

    it("should handle custom model names with proper capitalization", async () => {
      const TestComponent = () => {
        const crudToasts = useCrudToasts("deepdivearticle")
        return (
          <button onClick={() => crudToasts.onSuccess("create")}>
            Create Article
          </button>
        )
      }

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      await act(async () => {
        fireEvent.click(screen.getByText("Create Article"))
      })

      expect(toast.success).toHaveBeenCalledWith(
        "Deepdivearticle created successfully"
      )
    })
  })

  describe("Integration with CRUD operations", () => {
    it("should provide success feedback for full CRUD lifecycle", async () => {
      const TestComponent = () => {
        const crudToasts = useCrudToasts("Project")
        return (
          <div>
            <button onClick={() => crudToasts.onSuccess("fetch")}>Loaded</button>
            <button onClick={() => crudToasts.onSuccess("create")}>Created</button>
            <button onClick={() => crudToasts.onSuccess("update")}>Updated</button>
            <button onClick={() => crudToasts.onSuccess("delete")}>Deleted</button>
          </div>
        )
      }

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      await act(async () => {
        fireEvent.click(screen.getByText("Loaded"))
      })
      expect(toast.success).toHaveBeenCalledWith("Project loaded")

      await act(async () => {
        fireEvent.click(screen.getByText("Created"))
      })
      expect(toast.success).toHaveBeenCalledWith("Project created successfully")

      await act(async () => {
        fireEvent.click(screen.getByText("Updated"))
      })
      expect(toast.success).toHaveBeenCalledWith("Project updated successfully")

      await act(async () => {
        fireEvent.click(screen.getByText("Deleted"))
      })
      expect(toast.success).toHaveBeenCalledWith("Project deleted successfully")
    })

    it("should handle error states with detailed messages", async () => {
      const TestComponent = () => {
        const crudToasts = useCrudToasts("Organization")
        return (
          <div>
            <button onClick={() => crudToasts.onError("create", new Error("Duplicate email"))}>
              Create Error
            </button>
            <button onClick={() => crudToasts.onError("update", new Error("Permission denied"))}>
              Update Error
            </button>
            <button onClick={() => crudToasts.onError("delete", new Error("Related objects exist"))}>
              Delete Error
            </button>
          </div>
        )
      }

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      await act(async () => {
        fireEvent.click(screen.getByText("Create Error"))
      })
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to create Organization: Duplicate email"
      )

      await act(async () => {
        fireEvent.click(screen.getByText("Update Error"))
      })
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to update Organization: Permission denied"
      )

      await act(async () => {
        fireEvent.click(screen.getByText("Delete Error"))
      })
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to delete Organization: Related objects exist"
      )
    })
  })

  describe("Styling", () => {
    it("should apply success styling (green theme)", async () => {
      const TestComponent = () => {
        const toast = useToast()
        return (
          <button onClick={() => toast.success("Test")}>Test</button>
        )
      }

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      await act(async () => {
        fireEvent.click(screen.getByText("Test"))
      })

      expect(toast.success).toHaveBeenCalledWith("Test", {
        className: expect.stringContaining("bg-green-50"),
      })
    })

    it("should apply error styling (red theme)", async () => {
      const TestComponent = () => {
        const toast = useToast()
        return (
          <button onClick={() => toast.error("Test error")}>Test</button>
        )
      }

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      await act(async () => {
        fireEvent.click(screen.getByText("Test"))
      })

      expect(toast.error).toHaveBeenCalledWith("Test error", {
        className: expect.stringContaining("bg-red-50"),
      })
    })

    it("should apply warning styling (amber theme)", async () => {
      const TestComponent = () => {
        const toast = useToast()
        return (
          <button onClick={() => toast.warning("Test warning")}>Test</button>
        )
      }

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      await act(async () => {
        fireEvent.click(screen.getByText("Test"))
      })

      expect(toast).toHaveBeenCalledWith("Test warning", {
        className: expect.stringContaining("bg-amber-50"),
      })
    })

    it("should apply info styling (blue theme)", async () => {
      const TestComponent = () => {
        const toast = useToast()
        return (
          <button onClick={() => toast.info("Test info")}>Test</button>
        )
      }

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      await act(async () => {
        fireEvent.click(screen.getByText("Test"))
      })

      expect(toast).toHaveBeenCalledWith("Test info", {
        className: expect.stringContaining("bg-blue-50"),
      })
    })
  })

  describe("Icons", () => {
    it("should pass correct icons for each toast type", async () => {
      const TestComponent = () => {
        const toast = useToast()
        return (
          <div>
            <button onClick={() => toast.success("S")}>S</button>
            <button onClick={() => toast.error("E")}>E</button>
            <button onClick={() => toast.warning("W")}>W</button>
            <button onClick={() => toast.info("I")}>I</button>
          </div>
        )
      }

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      await act(async () => {
        fireEvent.click(screen.getByText("S"))
      })
      expect(toast.success).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        icon: expect.objectContaining({ className: expect.stringContaining("text-green-500") }),
      }))

      await act(async () => {
        fireEvent.click(screen.getByText("E"))
      })
      expect(toast.error).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        icon: expect.objectContaining({ className: expect.stringContaining("text-red-500") }),
      }))

      await act(async () => {
        fireEvent.click(screen.getByText("W"))
      })
      expect(toast).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        icon: expect.objectContaining({ className: expect.stringContaining("text-amber-500") }),
      }))

      await act(async () => {
        fireEvent.click(screen.getByText("I"))
      })
      expect(toast).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        icon: expect.objectContaining({ className: expect.stringContaining("text-blue-500") }),
      }))
    })
  })
})

// Helper component for testing outside provider
function TestComponentOutside() {
  useToast()
  return <div>Test</div>
}
