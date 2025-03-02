import test, { expect } from "@playwright/test";

// NOTE:
// This file includes tests on the pase using resources from other services, then
// consider burden of them before conducting those and DO NOT repeat the tests promiscuously!

test.describe("read rss feeds", () => {
    /** these tests expect the feeds to provide exactly five articles. If it changes, fix this value */
    const numberOfArticles = 5;
    const path = "rss";

    test("browse umamusume 5 articles", async( {page}, info) => {
        await page.goto(path);

        try {
            await expect(page.getByText("loading", {exact: false})).not.toBeVisible();
            await page.screenshot({path: "tests/screenshots/rss/"+info.project.name+"_umamusume"+".png", fullPage: true});
            await expect(page.getByText("Umamusume", {exact: true})).toBeVisible();

            const umaRss = page.locator("#umamusume-rss");
            const articles = await umaRss.locator(".article").all();
            expect(articles.length === numberOfArticles).toBeTruthy();

            const images = await umaRss.locator("img").all();
            expect(images.length === numberOfArticles).toBeTruthy();
        } catch (error){
            await page.screenshot({path: "tests/screenshots/rss/error/"+info.project.name+"_umamusume"+".png", fullPage: true});
            throw error;
        }
    });

    test("browse japan keiba 5 articles", async( {page}, info) => {
        await page.goto(path);

        try {
            await expect(page.getByText("loading", {exact: false})).not.toBeVisible();
            await page.screenshot({path: "tests/screenshots/rss/"+info.project.name+"_keiba"+".png", fullPage: true});
            await expect(page.getByText("Japan Keiba", {exact: true})).toBeVisible();

            const keibaRss = page.locator("#japankeiba-rss");
            const articles = await keibaRss.locator(".article").all();
            expect(articles.length === numberOfArticles).toBeTruthy();

            const images = await keibaRss.locator("img").all();
            expect(images.length === numberOfArticles).toBeTruthy();
        } catch (error){
            await page.screenshot({path: "tests/screenshots/rss/error/"+info.project.name+"_keiba"+".png", fullPage: true});
            throw error;
        }
    });
});