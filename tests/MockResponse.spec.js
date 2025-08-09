const emptyCardPayload = { message: "No Product in Cart" }
const { test, expect, request } = require('@playwright/test')


test('Mock Response - Cart API', async ({ browser }) => {

    const context = await browser.newContext()
    const page = await context.newPage()

    await page.goto('https://rahulshettyacademy.com/client')
    await page.locator('#userEmail').fill('sathishsuresh984@gmail.com')
    await page.locator('#userPassword').fill('Satz@984')
    await page.locator('#login').click()

    await page.waitForLoadState('networkidle')

    const addToCart = page.locator('div.card-body')
    const countOfProducts = await addToCart.count()
    for (let i = 0; i < countOfProducts; i++) {
        const btnAddToCart = addToCart.nth(i).locator('button', { hasText: ' Add To Cart' })
        await btnAddToCart.click()
        await page.waitForLoadState('networkidle')
        await page.waitForLoadState('load')
    }

    await page.route('https://rahulshettyacademy.com/api/ecom/user/get-cart-products/*',
        async route => {
            const response = page.request.fetch(route.request())
            let body = JSON.stringify(emptyCardPayload)
            route.fulfill({ response, body })
        }
    )

    await page.locator('button[routerlink="/dashboard/cart"]').click()
    await expect(page.locator('h1', { hasText: 'No Products in Your Cart !' })).toBeVisible()
})