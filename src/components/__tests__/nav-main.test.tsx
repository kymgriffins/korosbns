import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { NavMain, type NavItem } from "@/components/nav-main"
import { SidebarProvider } from "@/components/ui/sidebar"
import { IconCirclePlusFilled } from "@tabler/icons-react"

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/dashboard",
}))

// Mock motion
vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

function renderWithSidebar(ui: React.ReactElement) {
  return render(<SidebarProvider>{ui}</SidebarProvider>)
}

describe("NavMain", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const baseItems: NavItem[] = [
    { title: "Dashboard", url: "/dashboard", icon: IconCirclePlusFilled },
    { title: "Projects", url: "/projects", icon: IconCirclePlusFilled, badge: 5 },
  ]

  it("renders navigation items", () => {
    renderWithSidebar(<NavMain items={baseItems} />)
    expect(screen.getByText("Dashboard")).toBeInTheDocument()
    expect(screen.getByText("Projects")).toBeInTheDocument()
  })

  it("renders optional title", () => {
    renderWithSidebar(<NavMain items={baseItems} title="Main Menu" />)
    expect(screen.getByText("Main Menu")).toBeInTheDocument()
  })

  it("renders badges on items", () => {
    renderWithSidebar(<NavMain items={baseItems} />)
    expect(screen.getByText("5")).toBeInTheDocument()
  })

  it("renders quick create when enabled", () => {
    renderWithSidebar(<NavMain items={baseItems} showQuickActions />)
    expect(screen.getByText("Quick Create")).toBeInTheDocument()
  })

  it("does not render quick create by default", () => {
    renderWithSidebar(<NavMain items={baseItems} />)
    expect(screen.queryByText("Quick Create")).not.toBeInTheDocument()
  })

  describe("nested menus", () => {
    const itemsWithChildren: NavItem[] = [
      {
        title: "Organizations",
        icon: IconCirclePlusFilled,
        children: [
          { title: "List All", url: "/orgs" },
          { title: "Create", url: "/orgs/create" },
        ],
      },
    ]

    it("expands on click", () => {
      renderWithSidebar(<NavMain items={itemsWithChildren} />)

      fireEvent.click(screen.getByText("Organizations"))

      expect(screen.getByText("List All")).toBeInTheDocument()
      expect(screen.getByText("Create")).toBeInTheDocument()
    })

    it("stays open on second click until another section is selected", () => {
      renderWithSidebar(<NavMain items={itemsWithChildren} />)

      const btn = screen.getByText("Organizations")
      fireEvent.click(btn)
      expect(screen.getByText("List All")).toBeInTheDocument()

      fireEvent.click(btn)
      expect(screen.getByText("List All")).toBeInTheDocument()
    })
  })

  describe("edge cases", () => {
    it("handles empty items array", () => {
      renderWithSidebar(<NavMain items={[]} />)
      expect(screen.queryByRole("button")).not.toBeInTheDocument()
    })

    it("handles items without icons", () => {
      renderWithSidebar(<NavMain items={[{ title: "Plain", url: "/plain" }]} />)
      expect(screen.getByText("Plain")).toBeInTheDocument()
    })
  })
})
