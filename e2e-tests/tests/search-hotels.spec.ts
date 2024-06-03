import {test,expect} from '@playwright/test'

const UI_URL='http://localhost:5173/'

test.beforeEach(async({page})=>{
    await page.goto(UI_URL);

    await page.getByRole("link",{name: "Sign In"}).click();

    await expect(page.getByRole("heading",{name: "Sign In"})).toBeVisible();    

    await page.locator("[name=email]").fill("1@1.com");
    await page.locator('[name=password]').fill('password123');

    await page.getByRole('button',{name:"Login"}).click();

    await expect(page.getByText("sign in successfull!")).toBeVisible();
})


test("should hotel search results",async({page})=>{
    await page.goto(UI_URL);

    await page.getByPlaceholder("Where are you going").fill("Test City");
    await page.getByRole("button",{name: "Search"}).click();

    await expect(page.getByText("Hotels found in Test City")).toBeVisible();
    await expect(page.getByText("123Test_Hotel")).toBeVisible();
})