import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { SnippetCard } from "./snippet-card"

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

const baseProps = {
  id: "snippet-1",
  title: "Fetch API example",
  description: "A simple fetch wrapper",
  code: "const res = await fetch(url)\nreturn res.json()",
  language: "typescript",
  visibility: "PRIVATE" as const,
  slug: "fetch-api-example",
  tags: [],
}

describe("SnippetCard", () => {
  it("renders the snippet title", () => {
    render(<SnippetCard {...baseProps} />)
    expect(screen.getByText("Fetch API example")).toBeInTheDocument()
  })

  it("renders the description", () => {
    render(<SnippetCard {...baseProps} />)
    expect(screen.getByText("A simple fetch wrapper")).toBeInTheDocument()
  })

  it("renders the language badge", () => {
    render(<SnippetCard {...baseProps} />)
    expect(screen.getByText("typescript")).toBeInTheDocument()
  })

  it("renders a code preview", () => {
    render(<SnippetCard {...baseProps} />)
    expect(screen.getByRole("code")).toBeInTheDocument()
  })

  it("renders tags when provided", () => {
    const props = {
      ...baseProps,
      tags: [
        { tag: { id: "t1", name: "react" } },
        { tag: { id: "t2", name: "hooks" } },
      ],
    }
    render(<SnippetCard {...props} />)
    expect(screen.getByText("#react")).toBeInTheDocument()
    expect(screen.getByText("#hooks")).toBeInTheDocument()
  })

  it("links to the correct snippet page", () => {
    render(<SnippetCard {...baseProps} />)
    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("href", "/s/fetch-api-example")
  })

  it("copies code to clipboard when copy button is clicked", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })

    render(<SnippetCard {...baseProps} />)
    const copyButton = screen.getByRole("button")
    fireEvent.click(copyButton)

    expect(writeText).toHaveBeenCalledWith(baseProps.code)
  })
})
