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
        await page.locator("#first-red-factor-key").selectOption({label:"マイル"});
        const leftBar = await page.locator("#first-red-factor-star-bar");
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

        await page.locator("#second-red-factor-key").selectOption({label:"先行"});
        const rightbar = await page.locator("#second-red-factor-star-bar");
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

        await page.locator("#second-red-factor-key").selectOption({label:"長距離"});

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

        // make it empty with S condition
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

        // loosen the S condition. now it requires ダートC, 先行A, マイルA and 短距離D
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
        } else {
            const firstBarBox = await firstBar.boundingBox()!;
            await page.mouse.click(firstBarBox!.x + starWidth * (10), firstBarBox!.y);
        }
        await expect(page.locator("#first-red-factor")).toContainText("10");

        await page.locator("#fourth-red-factor-key").selectOption({label:"短距離"});
        const fourthBar = await page.locator("#fourth-red-factor-star-bar");
        if (info.project.name !== "firefox") {
            await fourthBar.hover({force: true, position: {x: 0, y: 0}});
            await page.mouse.down();
            await fourthBar.hover({force: true, position: {x: starWidth * (7), y: 0}});
            await page.mouse.up();
        } else {
            const fourthBarBox = await fourthBar.boundingBox()!;
            await page.mouse.click(fourthBarBox!.x + starWidth * (7), fourthBarBox!.y + fourthBarBox!.height/2);
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

        // make it empty with S condition
        await page.locator("#historic-condition-one-rank").selectOption({label:"S"});
        await page.locator("#historic-condition-one-key").selectOption({label:"ダート"});

        const innesRow =  page.locator(`#${innesUF9RowId}`);
        const donnaRow =  page.locator(`#${donnaUF8RowId}`);

        await innesRow.scrollIntoViewIfNeeded();
        await (await innesRow.getByRole("radio").all())[0].click(); // TODO use radio name instead
        await donnaRow.scrollIntoViewIfNeeded();
        await (await donnaRow.getByRole("radio").all())[1].click();
        await page.getByRole("button", {name: "refer to parent(s)"}).click();

        await page.locator('#first-red-factor-key') .scrollIntoViewIfNeeded();
        await page.screenshot({path: "tests/screenshots/histolicList/"+info.project.name+"_hof_ines_donna.png", fullPage: true});

        // options are NEVER visible in a browser screen, because the item which users see is a select or slot, not the option itself
        // anyway the existentce can be confirmed with .toBeVisible({"visible":false}).
        await expect(await (page.locator("#first-red-factor-key").getByRole("option",{selected: true,name: "ダート"}))).toBeVisible({"visible":false});
        await expect ( page.locator("#first-red-factor").locator("span").getByText("6", {"exact": true})).toBeVisible();
        await expect(await (page.locator('#second-red-factor-key').getByRole("option",{selected: true,name: "芝"}))).toBeVisible({"visible":false});
        await expect ( page.locator("#second-red-factor").locator("span").getByText("3", {"exact": true})).toBeVisible();
        await expect(await (page.locator('#third-red-factor-key').getByRole("option",{selected: true,name: "先行"}))).toBeVisible({"visible":false});
        await expect ( page.locator("#third-red-factor").locator("span").getByText("2", {"exact": true})).toBeVisible();

        await page.locator("#show-later-red-factor-button").click();
        await expect(await (page.locator('#fourth-red-factor-key').getByRole("option",{selected: true,name: "中距離"}))).toBeVisible({"visible":false});
        await expect ( page.locator("#fourth-red-factor").locator("span").getByText("6", {"exact": true})).toBeVisible();

        await page.screenshot({path: "tests/screenshots/histolicList/"+info.project.name+"_hof_ines_donna.png", fullPage: true}); 
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

    test("see the maya, the former representve", async ({page}, info) => {
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
        await expect(page.getByText("Power")).toBeVisible({visible:false});
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

test.describe("register a hall of fame uma", () => { // FIXME unstable in chrome
    const ines = "6794ed91931b9dbc095b3b80";
    test("refer to gentildonna default property", async ({page}, info) => {

        await page.goto("hof/register");
        const gentildonnaPanel = page.getByText("ジェンティルドンナ"); // expecting there isn't gentil with another dress
        const gentilPosition = await gentildonnaPanel.boundingBox();
        await page.mouse.click(gentilPosition!.x, gentilPosition!.y);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await page.getByText("refer!").click();
        await page.screenshot({path: "tests/screenshots/hof/register/"+info.project.name+"_gentil.png", fullPage: true});

        expect(await page.$eval("#property-late-selector",
            async late => (await new Promise(resolve => setTimeout(resolve, 2000)) // FIXME remove the dependence on waiting random duration
                    .then(() => late as HTMLInputElement)).value)
        ).toBe("D"); // FIXME resolve tangled await and promise

        expect(await page.$eval("#property-sprint-selector",
            async late => (await new Promise(resolve => setTimeout(resolve, 2000))
                    .then(() => late as HTMLInputElement)).value)
        ).toBe("G");

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

        await page.goto("hof/register");

        const fatherInput = page.locator("#father-id-input");
        await fatherInput.fill(ines);
        const motherInput = page.locator("#mother-id-input");
        await motherInput.fill(taiki);
        const viewButtons = await page.locator("div").filter({has: fatherInput}).getByRole("button",{name: "view"}).all();
        await viewButtons[0].click();
        await viewButtons[1].click();

        const gentildonnaPanel = page.getByText("ヴィブロス"); // expecting there isn't vivlos with another dress
        const gentilPosition = await gentildonnaPanel.boundingBox();
        await page.mouse.click(gentilPosition!.x, gentilPosition!.y);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await page.getByText("refer!").click();


        page.locator(".red-factor-selector").selectOption({label: "芝"});
        page.locator(".blue-factor-selector").selectOption({label: "パワー"});
        // page.locator(".green-factor-selector").selectOption({label: "固有"});

        // currently the three pulldowns for factor stars cannot be distinguished, then set the same value on all of those. 
        const starPulldowns = await page.locator(".left-side").locator("select").filter({hasText: "★☆☆"}).all();
        await starPulldowns[0].selectOption({label: "★★☆"});
        await starPulldowns[1].selectOption({label: "★★☆"});
        await starPulldowns[2].selectOption({label: "★★☆"});

        await page.locator("#creation-date").fill("2022-02-02");
        await page.locator("#point").fill("12345");
        await page.locator("#speed-input").fill("1234");
        await page.locator("#stamina-input").fill("987");
        await page.locator("#power-input").fill("1234");
        await page.locator("#guts-input").fill("456");
        await page.locator("#wisdom-input").fill("1111");
        await page.screenshot({path: "tests/screenshots/hof/register/"+info.project.name+"_vivlos.png", fullPage: true});

        // TODO add white factors
        
        page.on('dialog', dialog => {dialog.accept()});
        await page.getByRole("button", {name: "confirm"}).click();

        expect(await page.locator("#hof-register-confirm").inputValue()).toContain("hof");

        // anyway output the result
        const json = await page.locator("#hof-register-confirm").inputValue();
        fs.writeFileSync("tests/json/hof/register/"+info.project.name+"_vivlos.json",json);
        await page.screenshot({path: "tests/screenshots/hof/register/"+info.project.name+"_vivlos.png", fullPage: true});

        // then check details
        expect(await page.locator("#hof-register-confirm").inputValue()).toContain("\"late\":\"C\""); // FIXME chrome and webkit are unstable here

        // TODO check white factors 
    });
});