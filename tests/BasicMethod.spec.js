import {test, expect} from '@playwright/test'
import XLXS, {readFile} from 'xlsx'

test('Torrid - dev.web', async ({page}) => {

    //Launch website
    await page.goto('https://dev.web.torrid.com/');

    //verify title
    await expect(page).toHaveTitle(/Torrid/);

    //close dialog box
    await page.locator('#glClose').click();

    //search using sku id
    await page.locator('div.searchbox-wrapper-desktop  #q').fill('11661090');
    await page.locator('div.searchbox-wrapper-desktop  button[type="submit"]').click();

});

test('Mouse Hover', async({page}) => {

    //launch URL
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
    
    //verify element is hidden
    await expect(page.locator('a[href="#top"]')).not.toBeVisible();
    await expect(page.locator('a[href="#top"]')).toBeHidden();

    //hover 
    await page.locator('#mousehover').hover()

    //verify element is present
    await expect(page.locator('a[href="#top"]')).toBeVisible();
})

test('Upload file( single and multiple)', async ({browser}) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    const filePath1 = 'C:/Users/sathish.suresh/Documents/Playwright_2025/image_png.jpeg'
    const filePath2 = 'C:/Users/sathish.suresh/Documents/Playwright_2025/image_png (1).jpeg'

    //site 1(Able to upload multiple file)
    await page.goto('https://davidwalsh.name/demo/multiple-file-upload.php');
    await page.setInputFiles('#filesToUpload', filePath1 );

    await page.setInputFiles('#filesToUpload', [filePath1, filePath2]);

    //site 2(Able to upload only single file)
    await page.goto('https://commitquality.com/practice-file-upload');
    await page.setInputFiles('#file-input', filePath1);

    await browser.close();
})

test('Drag and drop', async ({page}) => {
    await page.goto('https://commitquality.com/practice-drag-and-drop');
    await page.locator('#small-box').dragTo(page.locator('div.large-box'));
    await page.waitForTimeout(2000)
    const element = page.getByTestId('large-box')
    await expect(element).toContainText('Success!');
})  


test('Shadown Root', async ({page}) => {
    await page.goto('https://practice.expandtesting.com/shadowdom')
    await page.getByText("Here's a basic button example.").isVisible()
    await page.getByText('This button is inside a Shadow DOM.').isVisible()
})

test('Frame', async ({page}) => {
    await page.goto('https://www.globalsqa.com/demo-site/frames-and-windows/#iFrame');

    //single frame
    const courseCountBefore = await page.locator('#portfolio_items a').count();
    console.log("Course Count without iframe: " +courseCountBefore);

    const frame = page.frameLocator('[name="globalSqa"]');
    const courseCountAfter = await frame.locator('#portfolio_items a').count();
    console.log("Course Count inside iframe: " +courseCountAfter);


    //Nested frame
    await page.goto('https://letcode.in/frame')
    const mainframe = page.frame('firstFr')

    const childFrames = mainframe.childFrames()
    console.log("Child Frames Count: "+childFrames.length);

    const emailField = childFrames[0].getByPlaceholder('Enter email');
    await emailField.fill('sathish@gmail.com')
    await expect(emailField).toHaveValue('sathish@gmail.com')
})


test('alert', async ({page}) => {

    await page.goto('https://rahulshettyacademy.com/AutomationPractice/')

    await page.locator('#name').fill('Sathish')
    page.on('dialog', dialog => dialog.accept())
    page.on('dialog', dialog => console.log(dialog.message()))

    await page.locator('#alertbtn').click()
    await page.locator('#name').fill('Suresh')
    await page.locator('#confirmbtn').click()
})

test('Web Table', async ({page}) => {
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/')
    const table = page.locator('table[name="courses"]');

    const row = table.locator('tr');
    const price = 25;

    //based on price value, we have print course name and instructor name
    for(let i=1; i<await row.count(); i++){
        const colName = await row.nth(i).locator('td').nth(2).textContent()
        if( colName == price){
            const course = await row.nth(i).locator('td').nth(1).textContent()
            const author = await row.nth(i).locator('td').nth(0).textContent()
            console.log("CourseName: "+ course)
            console.log("Instructor: "+author)
        }
    }
})

test('window Handling', async ({browser}) => {

    const context = await browser.newContext()
    const page = await context.newPage()

    //1. single window Handling
    await page.goto('https://www.globalsqa.com/demo-site/frames-and-windows/')

    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        await page.getByRole('link', {name: 'Click Here'}).click()
    ])
    expect(newPage.url()).toContain('#')

    //2. Multi Window Handling
    await page.goto('https://letcode.in/window')
    await Promise.all([
        await page.locator('#multi').click(),
    ])

    //get all windows
    await page.waitForTimeout(2000)  //wait for opening windows
    const allWindow = page.context().pages()
    console.log('Number of Window: '+allWindow.length)

    for(let i=0; i<allWindow.length; i++){
        console.log("URL: "+allWindow[i].url())
    }

})

test('download file', async ({page}, testInfo) => { 
    await page.goto('https://demo.automationtesting.in/FileDownload.html')
    
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        await page.getByRole('link', { name: 'Download' }).click(),
        await page.waitForTimeout(10000) //wait for download a file
    ])
    
    const filePath = download.suggestedFilename() //suggest fileName
    console.log(filePath)
    await download.saveAs(filePath) //save the file
})

test('Read Excel file', async ({page}) => {

    function readExcelData(path, sheetName){
        const workbook = XLXS.readFile(path)
        const sheet = workbook.Sheets[sheetName]
        const jsonSheet = XLXS.utils.sheet_to_json(sheet)
        return jsonSheet
    }
    const filepath = 'TestData.xlsx'
    const sheetName = 'Sheet1'
    const excelData = readExcelData(filepath, sheetName)

    await page.goto('https://rahulshettyacademy.com/loginpagePractise/')
    await page.locator('#username').fill(excelData[0].UserName)
    await page.locator('#password').fill(excelData[0].Password)
    await page.locator('#signInBtn').click()
    await expect(page.locator('h1.my-4')).toBeVisible()
})

test('Dropdown', async ({page}) => {
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/')
    const dropdown = page.locator('select.form-control')

    await dropdown.selectOption('Teacher')
    await dropdown.selectOption({label: 'Student'})
    await dropdown.selectOption({index: 0})
    await dropdown.selectOption({value: 'consult'})
})

test('Checkbox', async ({page}) => {
    await page.goto('https://commitquality.com/practice-general-components')
    const element = page.locator('input[name="checkbox1"]')
    
    await element.check()
    expect(element).toBeChecked()

    await element.uncheck()
    expect(element).not.toBeChecked()
})

test('Basic operation', async ({page}) => {
    await page.goto('https://commitquality.com/practice-general-components')
    const element = page.locator('div[class="links-container"] a', {hasText: 'My Youtube'}).first()
   
    //get Attribute value
    const attributeValue = await element.getAttribute('href')
    expect(attributeValue).toContain('youtube')

    //screenshot
    await element.screenshot({path: 'screenshot.png'})

    //waits
    await element.waitFor()
    await page.waitForTimeout(1000);
    await expect(element).toBeVisible({timeout: 1000})

    //get css value
    const bgColor = await element.evaluate((ele) => {
        return window.getComputedStyle(ele).getPropertyValue('background-color')
    })
    console.log(bgColor) //rgb(255, 255, 255)

    // UI verification
    await page.goto('https://letcode.in/edit')
    expect(await page.isDisabled('#noEdit')).toBeTruthy()
    expect(await page.isEditable('#dontwrite')).toBeFalsy()
    expect(await page.isEnabled('#noEdit')).toBeFalsy()

    //scroll
     await page.goto('https://commitquality.com/practice-general-components')
    const element1 = page.locator('div[class="links-container"] a', {hasText: 'My Youtube'}).first() 
    await element1.scrollIntoViewIfNeeded()
})


