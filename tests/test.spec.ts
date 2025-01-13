import test, { expect } from "@playwright/test";

test.describe("enjoy basic data browsing", () => {
    const turbo = "677d3fc061d0361aaedd4602";
    const notFoundId = "777777777777777777777777"; // if there is, change it!

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

    test("greet the stranger", async ( {page}, info) => {
        await page.goto(`historic/${notFoundId}`);
        await expect(page.getByText("NOT FOUND")).toBeVisible();
        await page.screenshot({path: "tests/screenshots/basic/"+info.project.name+"_stranger"+".png", fullPage: true});
    });
});

test.describe("historic list", () => {
    const starWidth = 15;

    const dartEUma = "メイショウドトウ【Dot-o'-Lantern】";

    const dartAUmaInSpecialStyle = "ユキノビジン【茶の子雪ん子】";
    const dartBUmaInNormalStyle = "ユキノビジン";

    const longATeio = "トウカイテイオー【紫雲の夢見取り】";
    const longBTeio = "トウカイテイオー";

    const dirtGMileC = "キタサンブラック";
    const dirtGMileALeadC = "アイネスフウジン";
    const dirtGMileBLeadE = "ビコーペガサス";

    test("shortlisting the umas with one condition", async ( {page}, info) => {
        await page.goto("historic/all");
        await expect(page.getByText(dartEUma)).toBeVisible();

        // see nothing (there is no umas having S property!)
        await page.locator("#historic-condition-one-rank").selectOption({label:"S"});
        await page.locator("#historic-condition-one-key").selectOption({label:"中距離"});
        await expect(page.getByText(dartEUma)).toBeVisible({visible:false});
        await page.screenshot({path: "tests/screenshots/histolicList/"+info.project.name+"_empty.png", fullPage: true});

        // then find ユキノ only in the Japanese style
        await page.locator("#historic-condition-one-rank").selectOption({label:"A"});
        await page.locator("#historic-condition-one-key").selectOption({label:"ダート"});
        await expect(page.getByText(dartAUmaInSpecialStyle)).toBeVisible(); // dirt A
        await expect(page.getByText(dartBUmaInNormalStyle, {exact: true})).toBeVisible({visible:false}); // dirt B
        await page.screenshot({path: "tests/screenshots/histolicList/"+info.project.name+"_DirtA.png", fullPage: true});

        // then find ドトウ again
        await page.locator("#historic-condition-one-rank").selectOption({label:"E"});
        await expect(page.getByText(dartEUma)).toBeVisible();
        await page.screenshot({path: "tests/screenshots/histolicList/"+info.project.name+"_DirtE.png", fullPage: true});
    });

    test("shortlisting umas with four conditions", async ( {page}, info) => {
        await page.goto("historic/all");
        await expect(page.getByText(dartEUma)).toBeVisible();

        // make all invisible with a impossible condition
        await page.locator("#historic-condition-one-rank").selectOption({label:"S"});
        await page.locator("#historic-condition-one-key").selectOption({label:"追込"});
        await expect(page.getByText(dartEUma)).toBeVisible({visible:false});

        await page.locator("#historic-condition-two-rank").selectOption({label:"A"});
        await page.locator("#historic-condition-two-key").selectOption({label:"芝"});
        await page.locator("#historic-condition-three-rank").selectOption({label:"A"});
        await page.locator("#historic-condition-three-key").selectOption({label:"先行"});
        await page.locator("#historic-condition-four-rank").selectOption({label:"A"});
        await page.locator("#historic-condition-four-key").selectOption({label:"長距離"});

        // loose the impossible condition
        await page.locator("#historic-condition-one-rank").selectOption({label:"E"});

        // テイオー's long properness was strengthend at the Shuntaisai
        await expect(page.getByText(longATeio)).toBeVisible();
        await expect(page.getByText(longBTeio, {exact: true})).toBeVisible({visible:false});
        await page.screenshot({path: "tests/screenshots/histolicList/"+info.project.name+"_quadrapleCondition.png", fullPage: true});
    })

    test("shortlisting umas with three conditions and factors", async ({page}, info) => {
        await page.goto("historic/all");
        await expect(page.getByText(dirtGMileALeadC, {exact: true})).toBeVisible();

        // make it empty with S condition
        await page.locator("#historic-condition-one-rank").selectOption({label:"S"});
        await page.locator("#historic-condition-one-key").selectOption({label:"ダート"});

        await page.screenshot({path: "tests/screenshots/histolicList/"+info.project.name+"_factors.png", fullPage: true});
        await expect(page.getByText(dirtGMileALeadC, {exact: true})).toBeVisible({visible:false});

        await page.locator("#historic-condition-two-rank").selectOption({label:"A"});
        await page.locator("#historic-condition-two-key").selectOption({label:"芝"});
        await page.locator("#historic-condition-three-rank").selectOption({label:"D"});
        await page.locator("#historic-condition-three-key").selectOption({label:"先行"});
        await page.locator("#historic-condition-four-rank").selectOption({label:"A"});
        await page.locator("#historic-condition-four-key").selectOption({label:"マイル"});

        // release S condition. now it requires 芝A, 先行D and マイルA
        await page.locator("#historic-condition-one-rank").selectOption({label:"G"});

        await page.screenshot({path: "tests/screenshots/histolicList/"+info.project.name+"_factors.png", fullPage: true});
        await expect(page.getByText(dirtGMileALeadC, {exact: true})).toBeVisible(); // mile A
        await expect(page.getByText(dirtGMileC, {exact: true})).toBeVisible({visible: false}); // mile C
        await expect(page.getByText(dirtGMileBLeadE, {exact: true})).toBeVisible({visible: false}); // mile B, lead E

        // make マイル +2 by 4 stars
        await page.locator("#father-red-factor-key").selectOption({label:"マイル"});
        const leftBar = await page.locator("#father-red-factor-star-bar");
        if (info.project.name !== "firefox") { // for some reason, firefox tests fail to move sliders or render changes cause by that
            await leftBar.hover({force: true, position: {x: 0, y: 0}});
            await page.mouse.down();
            await leftBar.hover({force: true, position: {x: starWidth * (4+1), y: 0}});
            await page.mouse.up();
        } else {
            const leftBarBox = await leftBar.boundingBox()!;
            await page.mouse.click(leftBarBox!.x + starWidth * (4+1), leftBarBox!.y);
        }

        await page.screenshot({path: "tests/screenshots/histolicList/"+info.project.name+"_factors.png", fullPage: true});
        await expect(page.getByText(dirtGMileC, {exact: true})).toBeVisible(); // mile C+2 => A
        await expect(page.getByText(dirtGMileBLeadE, {exact: true})).toBeVisible({visible:false}); // mile B+2 => A(not S), but lead E

        await page.locator("#mother-red-factor-key").selectOption({label:"先行"});
        const rightbar = await page.locator("#mother-red-factor-star-bar");
        if (info.project.name !== "firefox") { 
            await rightbar.hover( {force: true, position: {x: 0, y: 0}});
            await page.mouse.down();
            await rightbar.hover({force: true, position: {x: starWidth * (1+1), y: 0}});
            await page.mouse.up();
        } else {
            const rightBarBox = await rightbar.boundingBox()!;
            await page.mouse.click(rightBarBox!.x + starWidth * (4+1), rightBarBox!.y);
        }

        await page.screenshot({path: "tests/screenshots/histolicList/"+info.project.name+"_factors.png", fullPage: true});
        await expect(page.getByText(dirtGMileBLeadE, {exact: true})).toBeVisible();

        await page.locator("#mother-red-factor-key").selectOption({label:"長距離"});

        await page.screenshot({path: "tests/screenshots/histolicList/"+info.project.name+"_factors.png", fullPage: true});
        await expect(page.getByText(dirtGMileALeadC, {exact: true})).toBeVisible(); // mile A
        await expect(page.getByText(dirtGMileC, {exact: true})).toBeVisible(); // mile C
        await expect(page.getByText(dirtGMileBLeadE, {exact: true})).toBeVisible({visible:false}); // mile A but lead D
    });

    test("any red factor cannot make a S rank", async({page}, info) => {
        await page.goto("historic/all");
        await expect(page.getByText(dirtGMileALeadC, {exact: true})).toBeVisible();
        await expect(page.getByText(dartEUma, {exact: true})).toBeVisible();
        await expect(page.getByText(dartBUmaInNormalStyle, {exact: true})).toBeVisible();
        await expect(page.getByText(longATeio, {exact: true})).toBeVisible();
        await expect(page.getByText(longBTeio, {exact: true})).toBeVisible();
        await expect(page.getByText(dirtGMileC, {exact: true})).toBeVisible();
        await expect(page.getByText(dirtGMileALeadC, {exact: true})).toBeVisible();
        await expect(page.getByText(dirtGMileBLeadE, {exact: true})).toBeVisible();

        // 差し 20 stars
        await page.locator("#father-red-factor-key").selectOption({label:"差し"});
        const leftBar = await page.locator("#father-red-factor-star-bar");
        if (info.project.name !== "firefox") {
            await leftBar.hover({force: true, position: {x: 0, y: 0}});
            await page.mouse.down();
            await leftBar.hover({force: true, position: {x: starWidth * (10+1), y: 0}});
            await page.mouse.up();
        } else {
            const leftBarBox = await leftBar.boundingBox()!;
            await page.mouse.click(leftBarBox!.x + starWidth * (10+1), leftBarBox!.y);
        }
        await page.locator("#mother-red-factor-key").selectOption({label:"差し"});
        const rightbar = await page.locator("#mother-red-factor-star-bar");
        if (info.project.name !== "firefox") { 
            await rightbar.hover( {force: true, position: {x: 0, y: 0}});
            await page.mouse.down();
            await rightbar.hover({force: true, position: {x: starWidth * (10+1), y: 0}});
            await page.mouse.up();
        } else {
            const rightBarBox = await rightbar.boundingBox()!;
            await page.mouse.click(rightBarBox!.x + starWidth * (10+1), rightBarBox!.y);
        }

        // even 20 stars should not let ranks reach S 
        await page.locator("#historic-condition-one-rank").selectOption({label:"S"});
        await page.locator("#historic-condition-one-key").selectOption({label:"差し"});

        await page.screenshot({path: "tests/screenshots/histolicList/"+info.project.name+"_A_cap_empty.png", fullPage: true});
        await expect(page.getByText(dartEUma, {exact: true})).toBeVisible({visible:false});
        await expect(page.getByText(dartAUmaInSpecialStyle, {exact: true})).toBeVisible({visible:false});
        await expect(page.getByText(dartBUmaInNormalStyle, {exact: true})).toBeVisible({visible:false});
        await expect(page.getByText(longATeio, {exact: true})).toBeVisible({visible:false});
        await expect(page.getByText(longBTeio, {exact: true})).toBeVisible({visible:false});
        await expect(page.getByText(dirtGMileC, {exact: true})).toBeVisible({visible:false});
        await expect(page.getByText(dirtGMileALeadC, {exact: true})).toBeVisible({visible:false});
        await expect(page.getByText(dirtGMileBLeadE, {exact: true})).toBeVisible({visible:false});

        // but some umas should reach A by the stars
        await page.locator("#historic-condition-one-rank").selectOption({label:"A"});

        //   (no screenshot here to preserve the empty shot)
        await expect(page.getByText(dartEUma, {exact: true})).toBeVisible();
        await expect(page.getByText(dartAUmaInSpecialStyle, {exact: true})).toBeVisible({visible:false});
        await expect(page.getByText(dartBUmaInNormalStyle, {exact: true})).toBeVisible({visible:false});
        await expect(page.getByText(longATeio, {exact: true})).toBeVisible();
        await expect(page.getByText(longBTeio, {exact: true})).toBeVisible();
        await expect(page.getByText(dirtGMileC, {exact: true})).toBeVisible();
        await expect(page.getByText(dirtGMileALeadC, {exact: true})).toBeVisible({visible:false});
        await expect(page.getByText(dirtGMileBLeadE, {exact: true})).toBeVisible();
    });      
});

test.describe("view skill data", () => {
    const turboSkill = "エンジン全開！大噴射！";
    const magenta = "rgb(255, 0, 255)";

    test("find turbo inherent skill in magenta", async ({page}, info) => {
        await page.goto("skill/all");
        await page.screenshot({path: "tests/screenshots/skill/"+info.project.name+".png", fullPage: true});

        const turboSkillNameDiv = page.getByText(turboSkill);
        const turboRow = page.locator(".skill-row").filter({has: turboSkillNameDiv}); 

        await expect(turboRow).toBeVisible();
        await page.screenshot({path: "tests/screenshots/skill/"+info.project.name+".png", fullPage: true});
        await expect(turboRow.locator(".icon-wrapper").locator("img")).toBeVisible();
        await page.screenshot({path: "tests/screenshots/skill/"+info.project.name+".png", fullPage: true});
        await expect(turboRow).toHaveCSS("background-color", magenta);
    })
});