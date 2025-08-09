import { expect, test } from '@playwright/test'
const { HomePage } = require('../PageObjects/HomePage')
const { LoginPage } = require('../PageObjects/LoginPage')
const { CartPage } = require('../PageObjects/CartPage')
const { Utils } = require('../PageUtils/Utils')
const filepath = 'TestData.xlsx'
const sheetName = 'Sheet2'

test.beforeEach(async ({ page }) => {
    await page.goto('https://qa-practice.netlify.app/')
})


test.describe.configure({ mode: 'parallel' })
test('Invalid login', async ({ page }) => {
    const excelData = await Utils.readExcelData(filepath, sheetName)

    const homePage = new HomePage()
    await homePage.chooseEcommerce(page)

    const loginPage = new LoginPage()
    await loginPage.verifyLoginScreen(page)

    await loginPage.Login(page, excelData[1].UserName, excelData[1].Password)
    await loginPage.verifyLoginErrorMsg(page)
})

test('Valid login', async ({ page }) => {
    const excelData = await Utils.readExcelData(filepath, sheetName)

    const homePage = new HomePage()
    await homePage.chooseEcommerce(page)

    const loginPage = new LoginPage()
    await loginPage.verifyLoginScreen(page)

    await loginPage.Login(page, excelData[0].UserName, excelData[0].Password)

    const cartPage = new CartPage()
    await cartPage.verifyCartPage(page)
})


test('E2E order', async ({ page }) => {
    const excelData = await Utils.readExcelData(filepath, sheetName)

    const homePage = new HomePage()
    await homePage.chooseEcommerce(page)

    const loginPage = new LoginPage()
    await loginPage.verifyLoginScreen(page)

    await loginPage.Login(page, excelData[0].UserName, excelData[0].Password)

    const cartPage = new CartPage()
    await cartPage.verifyCartPage(page)
    await cartPage.addProductToBag(page)
    await cartPage.placeOrder(page)
    await cartPage.verifyOrderMsg(page)
})

test.only('Verify Order Total ', async ({ page }) => {

    const excelData = await Utils.readExcelData(filepath, sheetName)

    const homePage = new HomePage()
    await homePage.chooseEcommerce(page)
    await homePage.chooseProductList(page)

    const cartPage = new CartPage()
    let orderTotal = await cartPage.getOrderTotal(page)
    expect(orderTotal).toContain(excelData[0].ProductTotal)

    let productPrice = await cartPage.getyProductPrice(page)
    await cartPage.addProductToBag(page)

    orderTotal = await cartPage.getOrderTotal(page)
    expect(orderTotal).toContain(productPrice)

})