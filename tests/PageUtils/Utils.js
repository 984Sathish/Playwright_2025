import XLXS, { readFile } from 'xlsx'
const { expect } = require("@playwright/test")

class Utils {

    static async clickOnElement(page, selector) {
        const element = await page.locator(selector).first()
        await element.scrollIntoViewIfNeeded()
        await element.waitFor()
        await element.click({ force: true })
    }

    static async readExcelData(path, sheetName) {
        const workbook = XLXS.readFile(path)
        const sheet = workbook.Sheets[sheetName]
        const jsonSheet = XLXS.utils.sheet_to_json(sheet)
        return jsonSheet
    }

    static async waitForElement(page, locator) {
        const element = await page.locator(locator).first()
        await expect(element).toBeVisible()
    }

      static async getText(page, selector) {
        const element = await page.locator(selector).first()
        await element.scrollIntoViewIfNeeded()
        await element.waitFor()
        return await element.textContent()
    }
}

module.exports = { Utils }