import { test, expect } from "@playwright/test";
import { createTestUser, deleteTestUser } from "./helpers/auth";
import { formatDateTimeLocalInput } from "@/lib/utils/dates";

test.describe("Events CRUD", () => {
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

  test.beforeEach(async ({ page }) => {
    // Sign in before each test
    await page.goto("/login");
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("should create event with venues", async ({ page }) => {
    await page.goto("/events/new");

    // Fill in event form
    await page.fill('input[name="name"]', "Test Soccer Match");
    await page.selectOption('select[name="sport_type"]', "Soccer");
    
    // Set date/time (format: YYYY-MM-DDTHH:mm in local time)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const dateTimeString = formatDateTimeLocalInput(futureDate);
    await page.fill('input[type="datetime-local"]', dateTimeString);

    await page.fill('textarea[name="description"]', "Test event description");

    // Add first venue
    await page.fill('input[placeholder="Venue 1"]', "Stadium A");

    // Add second venue
    await page.click('button:has-text("Add Venue")');
    await page.fill('input[placeholder="Venue 2"]', "Stadium B");

    // Submit form
    await page.click('button[type="submit"]:has-text("Create Event")');

    // Should redirect to dashboard and show the new event
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator("text=Test Soccer Match")).toBeVisible();
    await expect(page.locator("text=Stadium A")).toBeVisible();
    await expect(page.locator("text=Stadium B")).toBeVisible();
  });

  test("should filter events by sport", async ({ page }) => {
    await page.goto("/dashboard");

    // Filter by Basketball
    await page.selectOption('select[aria-label="Filter by sport"]', "Basketball");

    // Should update URL
    await expect(page).toHaveURL(/sport=Basketball/);

    // All visible events should be Basketball (if any exist)
    const sportBadges = page.locator('text=/Basketball|Soccer|Tennis/');
    const count = await sportBadges.count();
    if (count > 0) {
      // If there are events, they should all be Basketball
      for (let i = 0; i < count; i++) {
        await expect(sportBadges.nth(i)).toHaveText("Basketball");
      }
    }
  });

  test("should search events by name", async ({ page }) => {
    await page.goto("/dashboard");

    // Search for a specific event name
    await page.fill('input[type="search"]', "Test");

    // Wait for debounce and URL update
    await page.waitForTimeout(400);
    await expect(page).toHaveURL(/q=Test/);

    // Results should contain "Test" in the name (if any exist)
    const eventNames = page.locator('text=/Test/i');
    const count = await eventNames.count();
    // If there are results, they should match the search
    if (count > 0) {
      await expect(eventNames.first()).toBeVisible();
    }
  });
});
