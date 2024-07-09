const puppeteer = require("puppeteer");
const fs = require("fs").promises;

async function getData() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = "https://www.topuniversities.com/programs/";

    try {
        await page.goto(url, { waitUntil: 'networkidle2' });
        let noPrograms = await page.evaluate(() => {
            const element = document.querySelector('.number_uni_pgm.number_uni_pgmHTML_js.check_when_hidden_js');
            return element ? element.innerText : null;
        });
        noPrograms = Number(noPrograms.split(" ")[0]) / 10;

        console.log(`Total pages: ${noPrograms}`);
        let data = [];

        for (let i = 2; i <= noPrograms; i++) {
            const pageUrl = `https://www.topuniversities.com/programs/?page=${i}`;
            await page.goto(pageUrl, { waitUntil: 'networkidle2' });
            const pageData = await page.$$eval("div.card", elements => {
                return elements.map(element => {
                    const titleElement = element.querySelector(".card-wrap > .programeTitle.apply_univ_name");
                    const anchorElement = titleElement ? titleElement.querySelector("a") : null;

                    const cardBody = element.querySelector(".card-wrap > .card-body");
                    const uniDetails = cardBody ? cardBody.querySelector(".uni-det") : null;
                    const uniLink = uniDetails ? uniDetails.querySelectorAll("a")[1] : null;
                    const uniPhoto = cardBody ? cardBody.querySelector("img") : null;
                    const location = cardBody ? cardBody.querySelector(".location") : null;

                    const uniListItem = cardBody ? cardBody.querySelector(".uni_list_itm") : null;
                    const uniRanking = uniListItem ? uniListItem.querySelectorAll(".cont") : [];

                    return {
                        title: titleElement ? titleElement.innerText.trim() : null,
                        url: anchorElement ? anchorElement.href : null,
                        university: uniLink ? uniLink.innerText.trim() : null,
                        universityUrl: uniLink ? uniLink.href : null,
                        universityLogo: uniPhoto ? uniPhoto.src : null,
                        location: location ? location.innerText.trim() : null,
                        ranking: uniRanking.length > 0 ? uniRanking[0].innerText.trim() : null,
                        stars: uniRanking.length > 1 ? uniRanking[1].innerText.trim() : null,
                    };
                });
            });
            data = data.concat(pageData); // Flattening the data array
        }

        // Write data to file
        await fs.writeFile("output.json", JSON.stringify(data, null, 2));
        console.log("Data written to output.json");

    } catch (e) {
        console.log(e);
    } finally {
        await browser.close();
    }
}

getData();
