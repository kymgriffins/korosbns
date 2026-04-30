import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import {
  formatDate,
  renderBooleanCell,
  renderTruncatedText,
} from "@/components/admin/crud-data-table"

describe("Table utility functions", () => {
  describe("formatDate", () => {
    it("formats valid date", () => {
      const result = formatDate("2025-01-15T10:30:00Z")
      expect(result).toContain("Jan")
      expect(result).toContain("15")
      expect(result).toContain("2025")
    })

    it("returns '-' for null/undefined", () => {
      expect(formatDate(null)).toBe("-")
      expect(formatDate(undefined)).toBe("-")
    })

    it("returns string for invalid date", () => {
      const result = formatDate("not-a-date")
      expect(result).toBe("not-a-date")
    })
  })

  describe("renderBooleanCell", () => {
    it("renders 'Active' for true", () => {
      const { container } = render(renderBooleanCell(true))
      expect(container.textContent).toContain("Active")
    })

    it("renders 'Inactive' for false", () => {
      const { container } = render(renderBooleanCell(false))
      expect(container.textContent).toContain("Inactive")
    })
  })

  describe("renderTruncatedText", () => {
    it("truncates long text with ellipsis", () => {
      const text = "a".repeat(100)
      const { container } = render(renderTruncatedText(text, 50))
      expect(container.textContent).toContain("a".repeat(50))
      expect(container.textContent).toContain("...")
    })

    it("does not truncate short text", () => {
      const { container } = render(renderTruncatedText("short", 50))
      expect(container.textContent).toBe("short")
    })

    it("includes full text in title attribute", () => {
      const text = "a".repeat(100)
      const { container } = render(renderTruncatedText(text, 50))
      const span = container.firstChild as HTMLElement
      expect(span.getAttribute("title")).toBe(text)
    })
  })
})
