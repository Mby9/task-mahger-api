const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit } = require('../src/math');

test('Should calculate total with tip', () => {
    const total = calculateTip(10, .3);
    expect(total).toBe(13);

    // if (total !== 13) {
    //     throw new Error('Total tiop should be 13. It is ' + total)
    // }
})

test('Should calculate total with default tip', () => {
    const total = calculateTip(10);
    expect(total).toBe(12.5);
})

test('Should convert fahrenheit to celcius', () => {
    const total = fahrenheitToCelsius(32);
    expect(total).toBe(0);
})

test('Should convert celcius to fahrenheit', () => {
    const total = celsiusToFahrenheit(0);
    expect(total).toBe(32);
})

test('Async test demo', (done) => {
    setTimeout(() => {
        expect(1).toBe(2);
        done();
    }, 2000)
})

test('Async test demo', (done) => {
    setTimeout(() => {
        expect(1).toBe(2);
        done();
    }, 2000)
})
 



// test('Hello World!', () => {

// });

// // Jest fails a test case when an error is thrown from the function
// test('This should fail', () => {
//     throw new Error('Failed');
// });

