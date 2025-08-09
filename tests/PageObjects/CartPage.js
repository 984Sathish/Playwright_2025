const { expect } = require("@playwright/test")
const {Utils} = require('../PageUtils/Utils')

class CartPage{

    constructor(){
        this.lblCart = 'h2.section-header'
        this.btnATB = 'button.shop-item-button'
        this.btnPurchase = 'button.btn-purchase'
        this.msgCongrats = '#message'
        this.txtOrderTotal = 'span.cart-total-price'
        this.txtProdPrice =  'span.shop-item-price'
        this.txtProdName = 'span.shop-item-title'
    }

    async verifyCartPage(page){
        await Utils.waitForElement(page, this.lblCart)
    }

    async addProductToBag(page){
        await Utils.clickOnElement(page, this.btnATB)
    }

    async placeOrder(page){
        await Utils.clickOnElement(page, this.btnPurchase)
    }

    async verifyOrderMsg(page){
        await Utils.waitForElement(page, this.msgCongrats)
    }

    async getOrderTotal(page){
        return await Utils.getText(page, this.txtOrderTotal)
    }

    async getyProductPrice(page){
        return await Utils.getText(page, this.txtProdPrice)
    }
}
module.exports = {CartPage}