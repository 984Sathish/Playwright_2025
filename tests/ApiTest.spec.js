const { test, expect, request } = require('@playwright/test')
const loginPaylod = { "Email": "sathishsuresh984@gmail.com", "Password": "Satz@984", "RememberMe": "false" }

test('Login API test - payload added from seperate variable', async () => {

    const apiContext = await request.newContext()
    const response = await apiContext.post('https://demowebshop.tricentis.com/login',
        {
            data: loginPaylod
        })
    expect(response.status() == 200).toBeTruthy()
})

test('Login API test - playload added in the request itself', async () => {

    const apiContext = await request.newContext()
    const response = await apiContext.post('https://demowebshop.tricentis.com/login',
        {
            data: {
                "Email": "sathishsuresh984@gmail.com",
                "Password": "Satz",
                "RememberMe": "false"
            }
        })
    expect(response.status() == 200).toBeTruthy()
})

test('Add product to Cart - Using Path Parameter', async () => {
    const id = '13'
    const index = '1'
    const apiContext = await request.newContext()
    const response = await apiContext.post(`https://demowebshop.tricentis.com/addproducttocart/catalog/${id}/${index}/${index}`)
    expect(response.status() == 200).toBeTruthy()

    const jsonRes = await response.json()
    expect(jsonRes.success).toBeTruthy()
    expect(jsonRes.message).toContain('product has been added')
})

test('checkout', async () => {
    const apiContext = await request.newContext()
    const response = await apiContext.post('https://demowebshop.tricentis.com/cart', {
        data: {
            "itemquantity5647486": 1,
            "CountryId": 0,
            "StateProvinceId": 0,
            "termsofservice": 'on',
            "checkout": 'checkout'
        }
    })

    expect(response.status() == 200).toBeTruthy()
})

    test('Order Creation', async () => {

        //login to the application
        let apiContext = await request.newContext()
        let response = await apiContext.post('https://rahulshettyacademy.com/api/ecom/auth/login', {
            data: {
                "userEmail": "sathishsuresh984@gmail.com",
                "userPassword": "Satz@984"
            }
        })

        expect(response.status() == 200).toBeTruthy()
        const jsonResponse = await response.json()
        const token = jsonResponse.token

        //get Product details
        const countryName = 'India'
        apiContext = await request.newContext()
        response = await apiContext.post('https://rahulshettyacademy.com/api/ecom/product/get-all-products', {
            data: {
                "productName": "",
                "minPrice": null,
                "maxPrice": null,
                "productCategory": [],
                "productSubCategory": [],
                "productFor": []
            },
            headers: {
                "content-type": "application/json",
                "authorization": token
            }
        })
        expect(response.status() == 200).toBeTruthy()
        const productJson = await response.json()
        const productId = productJson.data[0]._id

        //Placing new order
        apiContext = await request.newContext()
        response = await apiContext.post('https://rahulshettyacademy.com/api/ecom/order/create-order', {
            data: {
                "orders":
                    [{
                        "country": countryName,
                        "productOrderedId": productId
                    }]
            },
            headers: {
                "content-type": "application/json",
                "authorization": token
            }
        })
        expect(response.status() == 201).toBeTruthy()
        const resJson = await response.json()
        const orderId = resJson.orders
        const orderMsg = resJson.message
        console.log(orderMsg+" - "+orderId)
    })
