
const puppeteer = require('puppeteer');
const output = require('./output.json');

async function main() {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	const url = "https://www.topuniversities.com/programs";
	await page.goto(url, { waitUntil: 'networkidle2' });



	await browser.close();
}
main();
