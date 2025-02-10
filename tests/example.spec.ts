import { expect, test } from "@playwright/test";
import { setupUserClaims } from "./utils/auth";

test("Route To Home", async ({ context, page }) => {
  await setupUserClaims({ context });
  await page.goto("/");

  await expect(page).toHaveTitle("Dashboard | Peak LIMS");
});

test("Route To Accessions", async ({ context, page }) => {
  await setupUserClaims({ context });

  await context.route("**/peakorganizations/**", async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          id: "656ee8d0-ad36-41bd-8f59-ba94fbe20af2",
          name: "Test Organization",
        },
      ]),
    });
  });

  await context.route("**/accessions/worklist**", async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    });
  });

  await page.goto("/accessions");

  await expect(page).toHaveTitle("Accessioning Worklist | Peak LIMS");
  await expect(page.getByText("Accessioning Worklist")).toBeVisible();
});
