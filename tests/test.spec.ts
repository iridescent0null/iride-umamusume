import test, { expect } from "@playwright/test";

test.describe("enjoy basic data browsing", () => {
    const turbo = "677d3fc061d0361aaedd4602";

    test("find twinturbo in the all historic uma list", async ( {page}, info) => {
        await page.goto("historic/all");
        await expect(page.getByText("ツインターボ")).toBeVisible();
        await page.screenshot({path: "tests/screenshots/basic/"+info.project.name+"_turbo"+".png", fullPage: true});
    });

    test("browse twinturbo page", async ( {page}, info) => {
        await page.goto(`historic/${turbo}`);
        await expect(page.getByText("ツインターボ")).toBeVisible();
        await expect(page.getByText("ダート: ").getByText("F")).toBeVisible();
        await expect(page.getByText("逃げ: ").getByText("A")).toBeVisible();
        await expect(page.getByText("短距離: ").getByText("G")).toBeVisible();
        await page.screenshot({path: "tests/screenshots/basic/"+info.project.name+"_turbospec"+".png", fullPage: true});
    });
});