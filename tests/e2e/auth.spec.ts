import { test, expect } from "@playwright/test";
import { createTestUser, deleteTestUser } from "./helpers/auth";

test.describe("Authentication", () => {
  let testEmail: string;
  let testPassword: string;

  test.beforeAll(async () => {
    const user = await createTestUser();
    testEmail = user.email;
    testPassword = user.password;
  });

  test.afterAll(async () => {
    if (testEmail) {
      await deleteTestUser(testEmail);
    }
  });

  test("should sign in with email and password", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator("h1")).toContainText("Events Dashboard");
  });

  test("should show error for invalid credentials", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[type="email"]', "invalid@example.com");
    await page.fill('input[type="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator("text=/Invalid email or password/i")).toBeVisible();
  });
});
