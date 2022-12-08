const { Builder, By, until } = require('selenium-webdriver');

const app = 'http://localhost:5173/';

jest.setTimeout(30000);

test('Buy', async () => {
	let driver = await new Builder()
		.usingServer('http://localhost:4444/wd/hub')
		.forBrowser('chrome')
		.build();
	let price = 0;
	let balanceDiff = 0;
	let amountDiff = 0;
	try {
		await driver.get(app + 'auth');
		await driver.executeScript(function () {
			localStorage.setItem('uid', '0');
			localStorage.setItem('uname', 'John Doe');
		});
		await driver.get(app);
		await driver.findElement(By.css('.mdc-tab[tabindex="-1"]')).click();

		let item = await driver.wait(until.elementLocated(By.css('li:first-child')), 1000);
		await item.click();

		let priceNode = await driver.findElement(By.id('price'));
		let balanceNode = await driver.findElement(By.id('balance'));
		let amountNode = await driver.findElement(By.id('amount'));
		let buyBtn = await driver.findElement(By.id('buy-btn'));

		await driver.wait(until.elementTextMatches(priceNode, /^(((?!(NaN)).)*)$/));

		price = await priceNode.getText();
		balanceDiff = await balanceNode.getText();
		amountDiff = await amountNode.getText();
		await buyBtn.click();

		balanceDiff -= await balanceNode.getText();
		amountDiff -= await amountNode.getText();
	} finally {
		await driver.quit();
	}
	expect(balanceDiff - price).toBeLessThanOrEqual(0.001);
	expect(amountDiff).toBe(-1);
});

test('Sell', async () => {
	let driver = await new Builder()
		.usingServer('http://localhost:4444/wd/hub')
		.forBrowser('chrome')
		.build();
	let price = 0;
	let balanceDiff = 0;
	let amountDiff = 0;
	try {
		await driver.get(app + 'auth');
		await driver.executeScript(function () {
			localStorage.setItem('uid', '0');
			localStorage.setItem('uname', 'John Doe');
		});
		await driver.get(app);
		await driver.findElement(By.css('.mdc-tab[tabindex="-1"]')).click();

		let item = await driver.wait(until.elementLocated(By.css('li:first-child')), 1000);
		await item.click();

		let priceNode = await driver.findElement(By.id('price'));
		let balanceNode = await driver.findElement(By.id('balance'));
		let amountNode = await driver.findElement(By.id('amount'));
		let sellBtn = await driver.findElement(By.id('sell-btn'));

		await driver.wait(until.elementTextMatches(priceNode, /^(((?!(NaN)).)*)$/));

		price = await priceNode.getText();
		balanceDiff = await balanceNode.getText();
		amountDiff = await amountNode.getText();
		await sellBtn.click();

		balanceDiff = (await balanceNode.getText()) - balanceDiff;
		amountDiff -= await amountNode.getText();
	} finally {
		await driver.quit();
	}
	expect(balanceDiff - price).toBeLessThanOrEqual(0.001);
	expect(amountDiff).toBe(1);
});

test('Buy and Sell', async () => {
	let driver = await new Builder()
		.usingServer('http://localhost:4444/wd/hub')
		.forBrowser('chrome')
		.build();
	let priceDiff = 0;
	let balanceDiff = 0;
	let amountDiff = 0;
	try {
		await driver.get(app + 'auth');
		await driver.executeScript(function () {
			localStorage.setItem('uid', '0');
			localStorage.setItem('uname', 'John Doe');
		});
		await driver.get(app);
		await driver.findElement(By.css('.mdc-tab[tabindex="-1"]')).click();

		let item = await driver.wait(until.elementLocated(By.css('li:first-child')), 1000);
		await item.click();

		let priceNode = await driver.findElement(By.id('price'));
		let balanceNode = await driver.findElement(By.id('balance'));
		let amountNode = await driver.findElement(By.id('amount'));
		let buyBtn = await driver.findElement(By.id('buy-btn'));
		let sellBtn = await driver.findElement(By.id('sell-btn'));

		await driver.wait(until.elementTextMatches(priceNode, /^(((?!(NaN)).)*)$/));

		priceDiff = await priceNode.getText();
		balanceDiff = await balanceNode.getText();
		amountDiff = await amountNode.getText();
		await buyBtn.click();

		await driver.sleep(5000);
		await sellBtn.click();

		priceDiff -= await priceNode.getText();
		balanceDiff -= await balanceNode.getText();
		amountDiff -= await amountNode.getText();
	} finally {
		await driver.quit();
	}
	expect(Math.abs(balanceDiff - priceDiff)).toBeLessThanOrEqual(0.001);
	expect(amountDiff).toBe(0);
});
