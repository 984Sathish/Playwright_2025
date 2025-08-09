class HomePage{

    constructor(){
        this.btnLogin = '#auth-shop'
        this.btnProd = '#products-list'
    }

    async chooseEcommerce(page){
        await page.locator(this.btnLogin).click()
    }

    async chooseProductList(page){
        await page.locator(this.btnProd).click()
    }
}
module.exports = {HomePage}