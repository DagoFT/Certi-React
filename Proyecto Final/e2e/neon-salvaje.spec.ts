import { test, expect } from "@playwright/test";

test("Neon Salvaje realiza una acción mediante el backend", async ({ page }) => {
    await page.goto("/");

    const actionResponse = page.waitForResponse(
        (response) =>
            response.url().includes("/api/games/") &&
            response.url().includes("/action") &&
            response.request().method() === "POST",
    );

    await page.getByRole("button", { name: "→" }).click();

    const response = await actionResponse;

    expect(response.status()).toBe(200);
});