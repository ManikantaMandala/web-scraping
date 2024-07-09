// https://8s4gidso6c.execute-api.us-west-2.amazonaws.com/

const puppeteer = require("puppeteer");
const fs = require("fs").promises;

async function getData(){
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	const url = "https://grad.arizona.edu/admissions-guides/";

	try{
		
	}catch(e){
		console.log(e);
	}
}

getData();
