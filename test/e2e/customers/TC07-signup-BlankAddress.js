describe('Register a customer', function () {
	it('Register a customer with a blank address. Shouldnt redirect nor insert customer in DB.', function (){
		browser.get('http://localhost:3000/signup');
		
		// Insert values into form inputs
		element(by.model('customer.name')).sendKeys('John');
		element(by.model('customer.surname')).sendKeys('Doe');
		element(by.model('customer.email')).sendKeys('newmail7@mail.com');
		element(by.model('customer.password')).sendKeys('00000000');
		element(by.model('customer.address')).sendKeys('');
		element(by.cssContainingText('option', 'Congo')).click();
		element(by.model('customer.city')).sendKeys('Ciudad');
		element(by.model('customer.phone')).sendKeys('000000000');

		// Click on submit
		element(by.id('signup-submit')).click();

		// Check view didnt redirect
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/signup');
		
	});
});