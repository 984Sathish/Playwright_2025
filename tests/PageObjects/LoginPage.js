const { expect } = require("@playwright/test")
const {Utils} = require('../PageUtils/Utils')

class LoginPage{

    constructor(){
        this.lblLogin = '#loginSection'
        this.fldEmail = '#email'
        this.fldPaswd = '#password'
        this.btnSubmit = '#submitLoginBtn'
        this.txtAlert = '#message'
    }

    async verifyLoginScreen(page){
        await Utils.waitForElement(page, this.lblLogin)
    }

    async Login(page, username, password){
        await page.locator(this.fldEmail).fill(username)
        await page.locator(this.fldPaswd).fill(password)
        await page.locator(this.btnSubmit).click()
    }

      async verifyLoginErrorMsg(page){
        await Utils.waitForElement(page, this.txtAlert)
    }

}
module.exports = {LoginPage}