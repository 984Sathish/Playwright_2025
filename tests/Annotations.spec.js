const {test, expect} = require('@playwright/test')

test('Use only', async() => {
    console.log('Test Run: Use Only')
})

test.skip('Skip Test', async() => {

})

test.fixme('fixme Test', async() => {
     console.log('Test Run: Fix me test')
})

test.fail('fail Test', async() => {

})

test('Regression1', {tag: '@reg'}, async() => {
    console.log('Executed Regression1')
})

test('Regression2', {tag: '@reg'}, async() => {
    console.log('Executed Regression2')
})

test('Smoke', {tag: '@smoke'}, async() => {
    console.log('Executed Smoke')
})

test('@Web Execution', async() => {
    console.log('Web Execution')
})

test('@App Execution', async() => {
    console.log('App Execution')
})

test.describe('group of two test', () => {
    test('test 1', () => {
        console.log('Executed test 1')
    })
     test('test 2', () => {
        console.log('Executed test 2')
    })
})