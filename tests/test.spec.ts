import test, { expect } from "@playwright/test";
import fs from "fs";

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

    const dirtGSprintGMileCFrontB = "ゴールドシップ";

    const innshiShukaiPresetButtonTitle = "GI制覇 preset";

    test("shortlisting the umas with one condition", async ( {page}, info) => {
        await page.goto("historic/all");
        await expect(page.getByText(dartEUma)).toBeVisible();

        // see blank list (there is no umas having S property!)
        await page.locator("#historic-condition-one-rank").selectOption({label:"S"});
        await page.locator("#historic-condition-one-key").selectOption({label:"中距離"});
        await expect(page.getByText(dartEUma)).toBeVisible({visible:false});
        await page.screenshot({path: "tests/screenshots/histolicList/"+info.project.name+"_empty.png", fullPage: true});

        // then find ユキノ only in the Japanese clothes
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

        // see blank list (there is no umas having S property!)
        await page.locator("#historic-condition-one-rank").selectOption({label:"S"});
        await page.locator("#historic-condition-one-key").selectOption({label:"追込"});
        await expect(page.getByText(dartEUma)).toBeVisible({visible:false});

        // set moderate conditions
        await page.locator("#historic-condition-two-rank").selectOption({label:"A"});
        await page.locator("#historic-condition-two-key").selectOption({label:"芝"});
        await page.locator("#historic-condition-three-rank").selectOption({label:"A"});
        await page.locator("#historic-condition-three-key").selectOption({label:"先行"});
        await page.locator("#historic-condition-four-rank").selectOption({label:"A"});
        await page.locator("#historic-condition-four-key").selectOption({label:"長距離"});

        // then loose the impossible S condition. now it requires 芝A, 先行A and 長距離A
        await page.locator("#historic-condition-one-rank").selectOption({label:"E"});

        // テイオー's long properness was strengthend only in Shuntaisai style
        await expect(page.getByText(longATeio)).toBeVisible();
        await expect(page.getByText(longBTeio, {exact: true})).toBeVisible({visible:false});
        await page.screenshot({path: "tests/screenshots/histolicList/"+info.project.name+"_quadrapleCondition.png", fullPage: true});
    })

    test("shortlisting umas with three conditions and factors", async ({page}, info) => {
        await page.goto("historic/all");
        await expect(page.getByText(dirtGMileALeadC, {exact: true})).toBeVisible();

        // see blank list (there is no umas having S property!)
        await page.locator("#historic-condition-one-rank").selectOption({label:"S"});
        await page.locator("#historic-condition-one-key").selectOption({label:"ダート"});

        await page.screenshot({path: "tests/screenshots/histolicList/"+info.project.name+"_factors.png", fullPage: true});
        await expect(page.getByText(dirtGMileALeadC, {exact: true})).toBeVisible({visible:false});

        // set moderate conditions
        await page.locator("#historic-condition-two-rank").selectOption({label:"A"});
        await page.locator("#historic-condition-two-key").selectOption({label:"芝"});
        await page.locator("#historic-condition-three-rank").selectOption({label:"D"});
        await page.locator("#historic-condition-three-key").selectOption({label:"先行"});
        await page.locator("#historic-condition-four-rank").selectOption({label:"A"});
        await page.locator("#historic-condition-four-key").selectOption({label:"マイル"});

        // release S condition. now it requires 芝A, 先行D and マイルA
        await page.locator("#historic-condition-one-rank").selectOption({label:"G"});

        await page.screenshot({path: "tests/screenshots/histolicList/"+info.project.name+"_factors.png", fullPage: true});
        await expect(page.getByText(dirtGMileALeadC, {exact: true})).toBeVisible();
        await expect(page.getByText(dirtGMileC, {exact: true})).toBeVisible({visible: false});
        await expect(page.getByText(dirtGMileBLeadE, {exact: true})).toBeVisible({visible: false});

        // make マイル +2 by 4 stars
        await page.locator("#first-red-factor-key").selectOption({label:"マイル"});
        const leftBar = await page.locator("#first-red-factor-star-bar");
        if (info.project.name !== "firefox") { 
            await leftBar.hover({force: true, position: {x: 0, y: 0}});
            await page.mouse.down();
            await leftBar.hover({force: true, position: {x: starWidth * (4+1), y: 0}});
            await page.mouse.up();
        } else { // for some reason, firefox tests fail to move sliders, then just click the position instead
            const leftBarBox = await leftBar.boundingBox()!;
            await page.mouse.click(leftBarBox!.x + starWidth * (4+1), leftBarBox!.y + leftBarBox!.height/2);
        }

        await page.screenshot({path: "tests/screenshots/histolicList/"+info.project.name+"_factors.png", fullPage: true});
        await expect(page.getByText(dirtGMileC, {exact: true})).toBeVisible(); // mile C+2 => A
        await expect(page.getByText(dirtGMileBLeadE, {exact: true})).toBeVisible({visible: false}); // mile B+2 => A(not S), but lead E doesn't suffice (needed is D)

        // make 先行 +1 by a star
        await page.locator("#second-red-factor-key").selectOption({label:"先行"});
        const rightbar = await page.locator("#second-red-factor-star-bar");
        if (info.project.name !== "firefox") { 
            await rightbar.hover( {force: true, position: {x: 0, y: 0}});
            await page.mouse.down();
            await rightbar.hover({force: true, position: {x: starWidth * (1+1), y: 0}});
            await page.mouse.up();
        } else {
            const rightBarBox = await rightbar.boundingBox()!;
            await page.mouse.click(rightBarBox!.x + starWidth * (1+1), rightBarBox!.y + rightBarBox!.height/2);
        }

        await page.screenshot({path: "tests/screenshots/histolicList/"+info.project.name+"_factors.png", fullPage: true});
        await expect(page.getByText(dirtGMileBLeadE, {exact: true})).toBeVisible(); // now lead E+1 => D suffice the condition

        // get 先行 rank values to their orginal states
        await page.locator("#second-red-factor-key").selectOption({label:"長距離"});
        await page.screenshot({path: "tests/screenshots/histolicList/"+info.project.name+"_factors.png", fullPage: true});
        await expect(page.getByText(dirtGMileALeadC, {exact: true})).toBeVisible();
        await expect(page.getByText(dirtGMileC, {exact: true})).toBeVisible();
        await expect(page.getByText(dirtGMileBLeadE, {exact: true})).toBeVisible({visible: false});
    });

    test("any red factor cannot make an S rank", async({page}, info) => {
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
        await page.locator("#first-red-factor-key").selectOption({label:"差し"});
        const leftBar = await page.locator("#first-red-factor-star-bar");
        if (info.project.name !== "firefox") {
            await leftBar.hover({force: true, position: {x: 0, y: 0}});
            await page.mouse.down();
            await leftBar.hover({force: true, position: {x: starWidth * (10+1), y: 0}});
            await page.mouse.up();
        } else {
            const leftBarBox = await leftBar.boundingBox()!;
            await page.mouse.click(leftBarBox!.x + starWidth * (10+1), leftBarBox!.y + leftBarBox!.height/2);
        }
        await page.locator("#second-red-factor-key").selectOption({label:"差し"});
        const rightbar = await page.locator("#second-red-factor-star-bar");
        if (info.project.name !== "firefox") { 
            await rightbar.hover( {force: true, position: {x: 0, y: 0}});
            await page.mouse.down();
            await rightbar.hover({force: true, position: {x: starWidth * (10), y: 0}});
            await page.mouse.up();
        } else {
            const rightBarBox = await rightbar.boundingBox()!;
            await page.mouse.click(rightBarBox!.x + starWidth * (10), rightBarBox!.y + rightBarBox!.height/2);
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
    
    test("shortlisting umas with three conditions and six factors", async ({page}, info) => {
        await page.goto("historic/all");
        await expect(page.getByText(dirtGMileALeadC, {exact: true})).toBeVisible();

        // see blank list (there is no umas having S property!)
        await page.locator("#historic-condition-one-rank").selectOption({label:"S"});
        await page.locator("#historic-condition-one-key").selectOption({label:"ダート"});

        await page.locator("#show-later-red-factor-button").click();
        await expect(page.locator("#fourth-red-factor")).toContainText("☆");
        await expect(page.locator("#fifth-red-factor")).toContainText("☆");
        await expect(page.locator("#sixth-red-factor")).toContainText("☆");

        await page.screenshot({path: "tests/screenshots/histolicList/"+info.project.name+"_six_factors.png", fullPage: true});
        await expect(page.getByText(dirtGMileALeadC, {exact: true})).toBeVisible({visible:false});

        await page.locator("#historic-condition-two-rank").selectOption({label:"D"});
        await page.locator("#historic-condition-two-key").selectOption({label:"短距離"});
        await page.locator("#historic-condition-three-rank").selectOption({label:"A"});
        await page.locator("#historic-condition-three-key").selectOption({label:"先行"});
        await page.locator("#historic-condition-four-rank").selectOption({label:"A"});
        await page.locator("#historic-condition-four-key").selectOption({label:"マイル"});

        // loosen the S condition to C. now it requires ダートC, 先行A, マイルA and 短距離D
        await page.locator("#historic-condition-one-rank").selectOption({label:"C"});
        await page.screenshot({path: "tests/screenshots/histolicList/"+info.project.name+"_six_factors.png", fullPage: true});
        await expect(page.getByText(dirtGSprintGMileCFrontB, {exact: true})).not.toBeVisible(); 
        await page.screenshot({path: "tests/screenshots/histolicList/"+info.project.name+"_six_factors.png", fullPage: true});

        await page.locator("#first-red-factor-key").selectOption({label:"ダート"});
        const firstBar = await page.locator("#first-red-factor-star-bar");
        if (info.project.name !== "firefox") {
            await firstBar.hover({force: true, position: {x: 0, y: 0}});
            await page.mouse.down();
            await firstBar.hover({force: true, position: {x: starWidth * (10+1), y: 0}});
            await page.mouse.up();
        } else { // for some reason, firefox tests fail to move sliders, then just click the position instead
            const firstBarBox = await firstBar.boundingBox()!;
            await page.mouse.click(firstBarBox!.x + starWidth * (10), firstBarBox!.y + firstBarBox!.height/2); // FIXME why 11 doesn't work?
        }
        await expect(page.locator("#first-red-factor")).toContainText("10");

        await page.locator("#fourth-red-factor-key").selectOption({label:"短距離"});
        const fourthBar = await page.locator("#fourth-red-factor-star-bar"); 
        if (info.project.name !== "firefox") {
            await fourthBar.hover({force: true, position: {x: 0, y: 0}});
            await page.mouse.down();
            await fourthBar.hover({force: true, position: {x: starWidth * (7), y: 0}}); // FIXME why 8 doesn't work?
            await page.mouse.up();
        } else { 
            const fourthBarBox = await fourthBar.boundingBox()!;
            await page.mouse.click(fourthBarBox!.x + starWidth * (7), fourthBarBox!.y + fourthBarBox!.height/2); // FIXME why 8 doesn't work?
        }
        await expect(page.locator("#fourth-red-factor")).toContainText("7"); 

        await page.locator("#sixth-red-factor-key").selectOption({label:"マイル"});
        const sixthBar = await page.locator("#sixth-red-factor-star-bar");
        if (info.project.name !== "firefox") {
            await sixthBar.hover({force: true, position: {x: 0, y: 0}});
            await page.mouse.down();
            await sixthBar.hover({force: true, position: {x: starWidth * (4+1), y: 0}});
            await page.mouse.up();
        } else {
            const sixthBarBox = await sixthBar.boundingBox()!;
            await page.mouse.click(sixthBarBox!.x + starWidth * (4+1), sixthBarBox!.y + sixthBarBox!.height/2);
        }
        await expect(page.locator("#sixth-red-factor")).toContainText("4");

        await page.locator("#fifth-red-factor-key").selectOption({label:"先行"});
        const fifthBar = await page.locator("#fifth-red-factor-star-bar");
        if (info.project.name !== "firefox") {
            await fifthBar.hover({force: true, position: {x: 0, y: 0}});
            await page.mouse.down();
            await fifthBar.hover({force: true, position: {x: starWidth * (1+1), y: 0}});
            await page.mouse.up();
        } else {
            const fifthBarBox = await fifthBar.boundingBox()!;
            await page.mouse.click(fifthBarBox!.x + starWidth * (1+1), fifthBarBox!.y + fifthBarBox!.height/2);
        }
        await expect(page.locator("#fifth-red-factor")).toContainText("1");

        await page.screenshot({path: "tests/screenshots/histolicList/"+info.project.name+"_six_factors.png", fullPage: true});
        await expect(page.getByText(dirtGSprintGMileCFrontB, {exact: true})).toBeVisible(); 
        await page.screenshot({path: "tests/screenshots/histolicList/"+info.project.name+"_six_factors.png", fullPage: true});

        await page.locator("#sixth-red-factor-key").selectOption({label:"長距離"});
        await expect(page.getByText(dirtGSprintGMileCFrontB, {exact: true})).not.toBeVisible(); 
    });

    test("refer to red factors of innes and donna", async ({ page }, info) => {
        const innesUF9RowId = "hof-row-6794ed91931b9dbc095b3b80"; // turf 3 and intermediate 3*2
        const donnaUF8RowId = "hof-row-679b5c662361adf38c0cffd7"; // front 2 and dirt 3*2

        await page.goto("historic/all");
        await expect(page.getByText(dirtGMileALeadC, {exact: true})).toBeVisible();

        // see blank list (there is no umas having S property!)
        await page.locator("#historic-condition-one-rank").selectOption({label:"S"});
        await page.locator("#historic-condition-one-key").selectOption({label:"ダート"});

        const innesRow = page.locator(`#${innesUF9RowId}`);
        const donnaRow = page.locator(`#${donnaUF8RowId}`);

        // apparently there is no way to designate radio group, therefore we have to believe that playwright brings the radios in fixed order...
        await innesRow.scrollIntoViewIfNeeded();
        await (await innesRow.getByRole("radio").all())[0].click(); // 0 is left button, we believe
        await donnaRow.scrollIntoViewIfNeeded();
        await (await donnaRow.getByRole("radio").all())[1].click(); // 1 is right, we believe
        await page.getByRole("button", {name: "refer to parent(s)"}).click();

        await page.locator('#first-red-factor-key').scrollIntoViewIfNeeded();
        await page.screenshot({path: "tests/screenshots/histolicList/"+info.project.name+"_hof_ines_donna.png", fullPage: true});
        
        await expect ( page.locator("#first-red-factor-key").getByRole("option", {selected: true})).toHaveText("ダート");
        await expect ( page.locator("#first-red-factor").locator("span").getByText("6", {"exact": true})).toBeVisible();
        await expect ( page.locator("#second-red-factor-key").getByRole("option", {selected: true})).toHaveText("芝");
        await expect ( page.locator("#second-red-factor").locator("span").getByText("3", {"exact": true})).toBeVisible();
        await expect ( page.locator("#third-red-factor-key").getByRole("option", {selected: true})).toHaveText("先行");
        await expect ( page.locator("#third-red-factor").locator("span").getByText("2", {"exact": true})).toBeVisible();

        await page.locator("#show-later-red-factor-button").click();
        await expect(await (page.locator('#fourth-red-factor-key').getByRole("option",{selected: true,name: "中距離"}))).toBeVisible({"visible":false});
        await expect ( page.locator("#fourth-red-factor").locator("span").getByText("6", {"exact": true})).toBeVisible();

        await page.screenshot({path: "tests/screenshots/histolicList/"+info.project.name+"_hof_ines_donna.png", fullPage: true}); 
    });

    test("refer to and shortlisting hof umas", async ({ page }, info) => {
        const turfAIntermediateE = "ニシノフラワー【Sweet Juneberry】";

        const pearlUE1RowId = "hof-row-67a31eb4f32a56e411f3b56b";
        const fukukitaruUF4RowId = "hof-row-67960662931b9dbc095b44fe";
        await page.goto("historic/all");
        await expect(page.getByText(dirtGMileALeadC, {exact: true})).toBeVisible();

        // see blank list (there is no umas having S property!)
        await page.locator("#historic-condition-one-rank").selectOption({label:"S"});
        await page.locator("#historic-condition-one-key").selectOption({label:"ダート"});

        const pearlRow = page.locator(`#${pearlUE1RowId}`);
        const fukukitaruRow = page.locator(`#${fukukitaruUF4RowId}`);

        await pearlRow.scrollIntoViewIfNeeded();
        await (await pearlRow.getByRole("radio").all())[0].click(); // 0 is left button, we believe
        await fukukitaruRow.scrollIntoViewIfNeeded();
        await (await fukukitaruRow.getByRole("radio").all())[1].click(); // 1 is right, we believe

        // hide both beforehand
        await page.locator("#setHofRedFactorFilterFirst").selectOption("短距離");
        await expect(pearlRow).toBeVisible({visible:false});
        await expect(fukukitaruRow).toBeVisible({visible:false});

        await page.getByRole("button", {name: "refer to parent(s)"}).click();
        await expect(page.locator("#first-red-factor-key").getByRole("option", {selected: true})).toHaveText("ダート");
        await expect(page.locator("#first-red-factor").locator("span").getByText("10", {"exact": true})).toBeVisible();

        // make them show
        await page.locator("#setHofRedFactorFilterFirst").selectOption("ダート");
        await expect(pearlRow).toBeVisible({visible:true});
        await expect(fukukitaruRow).toBeVisible({visible:true});

        // hide both again, then release one of them
        await page.locator("#setHofRedFactorFilterSecond").selectOption("短距離");
        await page.locator("#setHofRedFactorFilterThird").selectOption("先行");
        await page.locator("#setHofRedFactorFilterSecond").selectOption("-");
        await expect(pearlRow).toBeVisible({visible:true});
        await expect(fukukitaruRow).toBeVisible({visible:false});

        // finally make historic ニシノ blink, who has E dirt
        await page.getByRole("button", {name: innshiShukaiPresetButtonTitle}).click(); // requiring  芝A, ダートC, 中距離B, マイルB
        await expect(page.locator(".uma-row").filter({hasText: turfAIntermediateE})).toBeVisible({visible:false});
        await page.screenshot({path: "tests/screenshots/histolicList/"+info.project.name+"_hof_pearl_fukukitaru.png", fullPage: true});

        await page.locator("#historic-condition-three-rank").selectOption({label:"D"});
        await expect(page.locator(".uma-row").filter({hasText: turfAIntermediateE})).toBeVisible({visible:true});
        await page.screenshot({path: "tests/screenshots/histolicList/"+info.project.name+"_hof_pearl_fukukitaru.png", fullPage: true}); 
    });

    test("shortlisting hof umas with their father or mother", async ({ page }, info) => { 
        const longMotherHoF = "6785f6ae35051cd1a38e565f";
        const intermediateFatherHoF = "679735422361adf38c0c8707";

        await page.goto("historic/all");
        await expect(page.getByText(dirtGMileALeadC, {exact: true})).toBeVisible();

        const longMotherHoFRow = page.locator(`#hof-row-${longMotherHoF}`);
        const intermediateFatherHoFRow = page.locator(`#hof-row-${intermediateFatherHoF}`);

        // hide both beforehand
        await page.locator("#setHofRedFactorFilterFirst").selectOption("短距離");
        await expect(longMotherHoFRow).toBeVisible({visible:false});
        await expect(intermediateFatherHoFRow).toBeVisible({visible:false});

        // then check
        await page.locator("#setHofRedFactorFilterFirst").selectOption("長距離"); // long && true
        await expect(longMotherHoFRow).toBeVisible({visible:true});
        await expect(intermediateFatherHoFRow).toBeVisible({visible:false});

        await page.locator("#setHofRedFactorFilterFourth").selectOption("中距離"); // long && intermediate
        await expect(longMotherHoFRow).toBeVisible({visible:true});
        await expect(intermediateFatherHoFRow).toBeVisible({visible:false});

        await page.locator("#setHofRedFactorFilterFourth").selectOption("追込"); // long && late
        await expect(longMotherHoFRow).toBeVisible({visible:false});
        await expect(intermediateFatherHoFRow).toBeVisible({visible:false});

        await page.locator("#setHofRedFactorFilterFirst").selectOption("-"); // true && late
        await expect(longMotherHoFRow).toBeVisible({visible:false});
        await expect(intermediateFatherHoFRow).toBeVisible({visible:false});

        await page.locator("#setHofRedFactorFilterFourth").selectOption("中距離"); // true && intermediate
        await expect(longMotherHoFRow).toBeVisible({visible:true});
        await expect(intermediateFatherHoFRow).toBeVisible({visible:true});

        await page.screenshot({path: "tests/screenshots/histolicList/"+info.project.name+"_hof_turbo_el.png", fullPage: true}); 
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

test.describe("browse umas in the Hall of Fame", () => {
    const turboId = "6785f6ae35051cd1a38e565f"; // expected to have specific factors as written below
    const mayaId = "678a168035051cd1a38f3c00"; // expected to have specific factors as written below
    const notFoundId = "777777777777777777777777"; // if there is, change it!

    test("see the maya, the former representve without her parents' skills", async ({page}, info) => {
        await page.goto(`hof/${mayaId}`);

        await expect(page.getByText("マヤノトップガン")).toBeVisible();

        const mainWhiteFactors = page.locator(".right-column");
        const mainTheOtherFactors = page.locator(".left-column");

        const staminaFactor = mainTheOtherFactors.getByText("スタミナ");
        await expect(staminaFactor).toBeVisible();
        await expect(staminaFactor.getByText("★★★")).toBeVisible();

        const intermediatFactor = mainTheOtherFactors.getByText("中距離");
        await expect(intermediatFactor).toBeVisible();
        await expect(intermediatFactor.getByText("★★★")).toBeVisible();

        const hanshinJFFactor = mainWhiteFactors.getByText("日本ダービー");
        await expect(hanshinJFFactor).toBeVisible();
        await expect(hanshinJFFactor.getByText("★★☆")).toBeVisible();

        const mechaGutsFactor = mainWhiteFactors.getByText("メカウマ娘シナリオ・GUTS");
        await expect(mechaGutsFactor).toBeVisible({visible: false});

        const suzukaFactor = mainWhiteFactors.getByText("急ぎ足");
        await expect(suzukaFactor).toBeVisible();
        await expect(suzukaFactor.getByText("★★★")).toBeVisible();
        await page.screenshot({path: "tests/screenshots/hof/"+info.project.name+"_maya.png", fullPage: true});
    });

    test("see the turbo with parents", async ({page}, info) =>{
        await page.goto(`hof/${turboId}`);
        await page.screenshot({path: "tests/screenshots/hof/"+info.project.name+".png", fullPage: true});

        await expect(page.getByText("ツインターボ")).toBeVisible();

        const mainWhiteFactors = page.locator(".right-column");
        const mainTheOtherFactors = page.locator(".left-column");

        const staminaFactor = mainTheOtherFactors.getByText("スタミナ");
        await expect(staminaFactor).toBeVisible();
        await expect(staminaFactor.getByText("★★★")).toBeVisible();

        const intermediatFactor = mainTheOtherFactors.getByText("中距離");
        await expect(intermediatFactor).toBeVisible();
        await expect(intermediatFactor.getByText("★★★")).toBeVisible();

        const hanshinJFFactor = mainWhiteFactors.getByText("阪神ジュベナイルフィリーズ");
        await expect(hanshinJFFactor).toBeVisible();
        await expect(hanshinJFFactor.getByText("★★☆")).toBeVisible();

        const mechaGutsFactor = mainWhiteFactors.getByText("メカウマ娘シナリオ・GUTS");
        await expect(mechaGutsFactor).toBeVisible();
        await expect(mechaGutsFactor.getByText("★★★")).toBeVisible();

        const suzukaFactor = mainWhiteFactors.getByText("先頭プライド");
        await expect(suzukaFactor).toBeVisible();
        await expect(suzukaFactor.getByText("★★☆")).toBeVisible();
        await page.screenshot({path: "tests/screenshots/hof/"+info.project.name+".png", fullPage: true});

        const yukino = page.locator("#father-information");

        const yukinoSpeedFactor = yukino.getByText("スピード");
        await expect(yukinoSpeedFactor).toBeVisible();
        await expect(yukinoSpeedFactor.getByText("★★★")).toBeVisible();

        const yukinoLongFactor = yukino.getByText("長距離");
        await expect(yukinoLongFactor).toBeVisible();
        await expect(yukinoLongFactor.getByText("★☆☆")).toBeVisible();

        const yukinoMoriokaFactor = yukino.getByText("盛岡レース場○");
        await expect(yukinoMoriokaFactor).toBeVisible();
        await expect(yukinoMoriokaFactor.getByText("★☆☆")).toBeVisible();

        const taiki = page.locator("#mother-information");

        const taikiSpeedFactor = taiki.getByText("スピード");
        await expect(taikiSpeedFactor).toBeVisible();
        await expect(taikiSpeedFactor.getByText("★★★")).toBeVisible();

        const taikiDirt = taiki.getByText("ダート");
        await expect(taikiDirt).toBeVisible();
        await expect(taikiDirt.getByText("★★★")).toBeVisible();

        const taikiKazekiri = taiki.getByText("風切り");
        await expect(taikiKazekiri).toBeVisible();
        await expect(taikiKazekiri.getByText("★★☆")).toBeVisible();
    });

    test("see NOT FOUND page with a wrong id", async ({page}, info) => {
        await page.goto(`hof/${notFoundId}`);

        await expect(page.getByText("NOT FOUND")).toBeVisible();
        await expect(page.getByText("パワー")).toBeVisible({visible:false});
        await expect(page.getByText("固有")).toBeVisible({visible:false});
    });
});

test.describe("browse the hof uma list", () => {
    test("count turbo effective stars", async ({page}, info) => {
        const turboCreationDate = "2024/12/23";
        await page.goto("hof/all");

        const turboDate = page.getByText(turboCreationDate);
        const turboRow = page.locator(".hof-row").filter({has: turboDate}); 

        const staminaFactor = turboRow.getByText("スタミナ");
        await expect(staminaFactor.getByText("★★★")).toBeVisible();

        const speedFactors = await turboRow.getByText("スピード").all();
        await expect(speedFactors[0].getByText("★★★")).toBeVisible();
        await expect(speedFactors[1].getByText("★★★")).toBeVisible();

        const intermediateFactor = turboRow.getByText("中距離");
        await expect(intermediateFactor.getByText("★★★")).toBeVisible();

        const longFactor = turboRow.getByText("長距離");
        await expect(longFactor.getByText("★☆☆")).toBeVisible();

        const dirtFactor = turboRow.getByText("ダート");
        await expect(dirtFactor.getByText("★★★")).toBeVisible();

        const inherentFactors = await turboRow.getByText("固有").all();
        const inherentFactorsInnerTexts = await Promise.all(inherentFactors.map(locator => locator.innerHTML()));
        expect(inherentFactorsInnerTexts.filter(html => html.includes("★★☆")).length === 2).toBeTruthy();
        expect(inherentFactorsInnerTexts.filter(html => html.includes("★☆☆")).length === 1).toBeTruthy();
        expect(inherentFactorsInnerTexts.filter(html => html.includes("☆☆☆")).length === 0).toBeTruthy();
    });

    test("count nishino stars including her ancestors", async ({page}, info) => {
        const nishinoCreationDate = "2025/1/25";
        await page.goto("hof/all");

        const nishinoDate = page.getByText(nishinoCreationDate);
        const nishinoRow = page.locator(".hof-row").filter({has: nishinoDate}); 

        const speedFactors = await nishinoRow.getByText("スピード").all();
        await expect(speedFactors[0].getByText("★★★")).toBeVisible();
        await expect(speedFactors[1].getByText("★★★")).toBeVisible();
        await expect(speedFactors[2].getByText("★★★")).toBeVisible();

        const turfFactors = await nishinoRow.getByText("芝").all();
        await expect(turfFactors[0].getByText("★★★")).toBeVisible();
        await expect(turfFactors[1].getByText("★★★")).toBeVisible();
        expect(turfFactors.length === 2).toBeTruthy();

        const inherentFactors = await nishinoRow.getByText("固有").all();
        const inherentFactorsInnerTexts = await Promise.all(inherentFactors.map(locator => locator.innerHTML()));
        expect(inherentFactorsInnerTexts.filter(html => html.includes("★★★")).length === 0).toBeTruthy();
        expect(inherentFactorsInnerTexts.filter(html => html.includes("★★☆")).length === 2).toBeTruthy();
        expect(inherentFactorsInnerTexts.filter(html => html.includes("★☆☆")).length === 1).toBeTruthy();
        expect(inherentFactors.length === 3).toBeTruthy();
    });
});

test.describe("register a hall of fame uma", () => {
    const ines = "6794ed91931b9dbc095b3b80";
    test("refer to gentildonna default property", async ({page}, info) => {

        await page.goto("hof/register");
        const gentildonnaPanel = page.getByText("ジェンティルドンナ"); // expecting there isn't gentil with another dress
        const gentilPosition = await gentildonnaPanel.boundingBox();
        await page.mouse.click(gentilPosition!.x, gentilPosition!.y);

        // wait for rendering options in the pulldowns (needed in chrome)
        await expect(page.locator("#property-late-selector").getByRole("option", {selected: false, name: "D"})).toBeVisible({"visible": false}); 
        await expect(page.locator("#property-sprint-selector").getByRole("option", {selected: false, name: "G"})).toBeVisible({"visible": false});

        await page.getByText("refer!").click();
        await page.screenshot({path: "tests/screenshots/hof/register/"+info.project.name+"_gentil.png", fullPage: true});

        await expect(page.locator("#property-late-selector").getByRole("option", {selected: true})).toHaveText("D");
        await expect(page.locator("#property-sprint-selector").getByRole("option", {selected: true})).toHaveText("G");
        await page.screenshot({path: "tests/screenshots/hof/register/"+info.project.name+"_gentil.png", fullPage: true});
    });

    test("set her father", async ({page}, info) => {
        await page.goto("hof/register");
        const fatherInput = page.locator("#father-id-input");
        await fatherInput.fill(ines);

        const viewButtons = await page.locator("div").filter({has: fatherInput}).getByRole("button",{name: "view"}).all();
        await viewButtons[0].click();
        await viewButtons[1].click();
        await page.screenshot({path: "tests/screenshots/hof/register/"+info.project.name+"_ines.png", fullPage: true});

        const father = page.locator("div").filter({has: fatherInput}).locator(".hof-row");
        const fatherRedFactor = father.getByText("芝");
        await expect(fatherRedFactor).toBeVisible();
        await expect(fatherRedFactor.getByText("★★★")).toBeVisible();
        const fatherBlueFactor = father.getByText("スピード");
        await expect(fatherBlueFactor).toBeVisible();
        await expect(fatherBlueFactor.getByText("★★★")).toBeVisible();
        const fatherGreenFactor = father.getByText("固有");
        await expect(fatherGreenFactor).toBeVisible();
        await expect(fatherGreenFactor.getByText("★☆☆")).toBeVisible();
        await page.screenshot({path: "tests/screenshots/hof/register/"+info.project.name+"_ines.png", fullPage: true});
    });

    // expecting the path exists: tests/json/hof/register
    test("generate json", async ({page},info) => {
        const taiki = "678a72ce931b9dbc095a0f35";
        const selectedBorderRegex = /rgb\(238, 130, 238\)/; // violet

        // regexs to check the generated json
        const oshikiri = "678a12f135051cd1a38f3b23";
        const oshikiri3Regex = /{\"star\":[\s]{0,2}3,[\s]{0,2}\"skill\":[\s]{0,2}\"678a12f135051cd1a38f3b23\"}/;
        const chokkakou = "679788c72361adf38c0c8ac5";
        const chokkakouAnyRegex = /{\"star\":[\s]{0,2}\d,[\s]{0,2}\"skill\":[\s]{0,2}\"679788c72361adf38c0c8ac5\"}/;
        const jdd = "6784faad3baffe29bd653f76";
        const jdd2Regex = /{\"star\":[\s]{0,2}2,[\s]{0,2}\"race\":[\s]{0,2}\"6784faad3baffe29bd653f76\"}/;
        const asahiFS = "6784fd463baffe29bd653f90";
        const asahiFS1Regex = /{\"star\":[\s]{0,2}1,[\s]{0,2}\"race\":[\s]{0,2}\"6784fd463baffe29bd653f90\"}/;
        const mechaGuts = "67850f073baffe29bd653fa3";
        const mechaGuts1Regex = /{\"star\":[\s]{0,2}1,[\s]{0,2}\"scenario\":[\s]{0,2}\"67850f073baffe29bd653fa3\"}/;

        await page.goto("hof/register");

        const fatherInput = page.locator("#father-id-input");
        await fatherInput.fill(ines);
        const motherInput = page.locator("#mother-id-input");
        await motherInput.fill(taiki);
        const viewButtons = await page.locator("div").filter({has: fatherInput}).getByRole("button",{name: "view"}).all();
        await viewButtons[0].click();
        await viewButtons[1].click();

        const vivlosPanel = page.getByText("ヴィブロス"); // expecting there isn't vivlos with another dress
        const vivlosPosition = await vivlosPanel.boundingBox();
        await page.mouse.click(vivlosPosition!.x, vivlosPosition!.y);
        await expect(page.locator(".selected").getByRole("img")).toHaveCSS("border", selectedBorderRegex);

        // wait for rendering the option, push the button, and then wait for the option selected (needed in chrome test)
        await expect(page.locator("#property-late-selector").getByRole("option", {selected: false, name: "C"})).toBeVisible({"visible": false});
        await page.getByText("refer!").click();
        await expect(page.locator("#property-late-selector").getByRole("option", {selected: true})).toHaveText("C");
        await page.screenshot({path: "tests/screenshots/hof/register/"+info.project.name+"_temp.png", fullPage: true});

        page.locator(".red-factor-selector").selectOption({label: "芝"});
        page.locator(".blue-factor-selector").selectOption({label: "パワー"});
        // page.locator(".green-factor-selector").selectOption({label: "固有"});

        // currently the three pulldowns for factor stars cannot be distinguished, then set the same value on all of those. 
        const starPulldowns = await page.locator(".left-side").locator("select").filter({hasText: "★☆☆"}).all();
        await starPulldowns[0].selectOption({label: "★★☆"});
        await starPulldowns[1].selectOption({label: "★★☆"});
        await starPulldowns[2].selectOption({label: "★★☆"});

        // fill a value and prepare regex for the value one by one
        await page.locator("#creation-date").fill("2022-02-02");
        const creationRegex = /\"created\":[\s]{0,2}\"2022-02-02T/;
        await page.locator("#point").fill("12345");
        const pointRegex = /\"point\":[\s]{0,2}12345/;
        await page.locator("#speed-input").fill("1234");
        const speedRegex = /\"speed\":[\s]{0,2}1234/;
        await page.locator("#stamina-input").fill("987");
        const staminaRegex = /\"stamina\":[\s]{0,2}987/;
        await page.locator("#power-input").fill("1234");
        const powerRegex = /\"power\":[\s]{0,2}1234/;
        await page.locator("#guts-input").fill("456");
        const gutsRegex = /\"guts\":[\s]{0,2}456/;
        await page.locator("#wisdom-input").fill("1111");
        const wisdonRegex = /\"wisdom\":[\s]{0,2}1111/;
        await page.screenshot({path: "tests/screenshots/hof/register/"+info.project.name+"_vivlos.png", fullPage: true});

        const oshikiriRow = page.locator(".check-object-pair").filter({"hasText": oshikiri});
        await (oshikiriRow.getByRole("combobox").selectOption("★★★"));
        const chokkakouRow = page.locator(".check-object-pair").filter({"hasText": chokkakou});
        await (chokkakouRow.getByRole("combobox").selectOption("★★★"));
        await (chokkakouRow.getByRole("combobox").selectOption("-"));
        
        const jddRowWrapper = page.locator(`#selector-${jdd}`);
        await (jddRowWrapper.getByRole("combobox").selectOption("★★☆"));
        const asahiFSRowWrapper = page.locator(`#selector-${asahiFS}`);
        await (asahiFSRowWrapper.getByRole("combobox").selectOption("★☆☆"));

        const gutsRowWrapper = page.locator(`#selector-${mechaGuts}`);
        await (gutsRowWrapper.getByRole("combobox").selectOption("★☆☆"));
        
        page.on('dialog', dialog => {dialog.accept()});
        
        await page.getByRole("button", {name: "confirm"}).click();
        expect(await page.locator("#hof-register-confirm").inputValue()).toContain("hof");

        // anyway output the result
        const json = await page.locator("#hof-register-confirm").inputValue();
        fs.writeFileSync("tests/json/hof/register/"+info.project.name+"_vivlos.json",json);
        await page.screenshot({path: "tests/screenshots/hof/register/"+info.project.name+"_vivlos.png", fullPage: true});

        // then check details
        expect(await page.locator("#hof-register-confirm").inputValue()).toContain("\"late\":\"C\"");
        expect(await page.locator("#hof-register-confirm").inputValue()).toMatch(oshikiri3Regex);
        expect(await page.locator("#hof-register-confirm").inputValue()).not.toMatch(chokkakouAnyRegex);
        expect(await page.locator("#hof-register-confirm").inputValue()).toMatch(jdd2Regex);
        expect(await page.locator("#hof-register-confirm").inputValue()).toMatch(asahiFS1Regex);
        expect(await page.locator("#hof-register-confirm").inputValue()).toMatch(mechaGuts1Regex);
        expect(await page.locator("#hof-register-confirm").inputValue()).toMatch(creationRegex);
        expect(await page.locator("#hof-register-confirm").inputValue()).toMatch(pointRegex);
        expect(await page.locator("#hof-register-confirm").inputValue()).toMatch(speedRegex);
        expect(await page.locator("#hof-register-confirm").inputValue()).toMatch(staminaRegex);
        expect(await page.locator("#hof-register-confirm").inputValue()).toMatch(powerRegex);
        expect(await page.locator("#hof-register-confirm").inputValue()).toMatch(gutsRegex);
        expect(await page.locator("#hof-register-confirm").inputValue()).toMatch(wisdonRegex);
    });
});