import { test, expect } from "@playwright/test"

test.describe("Snippets", () => {
  test("redirects to dashboard when authenticated", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test("shows My Snippets heading on dashboard", async ({ page }) => {
    await page.goto("/dashboard")
    await expect(page.getByRole("heading", { name: /my snippets/i })).toBeVisible()
  })

  test("shows New snippet button", async ({ page }) => {
    await page.goto("/dashboard")
    await expect(page.getByRole("link", { name: /new snippet/i })).toBeVisible()
  })

  test("can navigate to create snippet page", async ({ page }) => {
    await page.goto("/dashboard")
    await page.getByRole("link", { name: /new snippet/i }).click()
    await expect(page).toHaveURL(/\/dashboard\/new/)
    await expect(page.getByRole("heading", { name: /new snippet/i })).toBeVisible()
  })

  test("can create a snippet", async ({ page }) => {
    await page.goto("/dashboard/new")

    await page.getByPlaceholder("My awesome snippet...").fill("E2E Test Snippet")
    await page.getByPlaceholder("What does this snippet do?").fill("Created by E2E test")

    await page.getByRole("button", { name: /create snippet/i }).click()

    await expect(page).toHaveURL(/\/s\/e2e-test-snippet/, { timeout: 10_000 })
    await expect(page.getByRole("heading", { name: "E2E Test Snippet" })).toBeVisible()
  })

  test("shows snippet in dashboard after creation", async ({ page }) => {
    await page.goto("/dashboard")
    await expect(page.getByText("E2E Test Snippet")).toBeVisible()
  })

  test("can search for a snippet", async ({ page }) => {
    await page.goto("/dashboard")
    await page.getByPlaceholder("Search snippets...").fill("E2E Test")
    await expect(page.getByText("E2E Test Snippet")).toBeVisible()
  })

  test("can edit a snippet", async ({ page }) => {
    await page.goto("/dashboard")
    await page.getByText("E2E Test Snippet").click()
    await expect(page).toHaveURL(/\/s\//)

    await page.getByRole("link", { name: /edit/i }).click()
    await expect(page).toHaveURL(/\/dashboard\/edit\//)

    await page.getByPlaceholder("My awesome snippet...").fill("E2E Test Snippet Updated")
    await page.getByRole("button", { name: /save changes/i }).click()

    await expect(page.getByRole("heading", { name: "E2E Test Snippet Updated" })).toBeVisible()
  })

  test("can delete a snippet", async ({ page }) => {
    await page.goto("/dashboard")
    await page.getByText("E2E Test Snippet Updated").click()

    await page.getByRole("button", { name: /delete/i }).click()
    await page.getByRole("button", { name: /confirm delete/i }).click()

    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page.getByText("E2E Test Snippet Updated")).not.toBeVisible()
  })
})
