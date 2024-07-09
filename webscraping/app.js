const puppeteer = require('puppeteer');
const fs = require('fs');
const writer = fs.createWriteStream('trolled2.csv');
writer.write(`'Country'\t 'Degree'\t 'Course'\t 'Specialization' \t'Name'\t 'Uni'\t 'Loc'\t 'Duration'\t 'Fee'\t 'Lang'\t 'ProgDesc'\t 'EligCriteria'\t 'Career'\t 'DeadLine'\n`);
var stop=false;
const url = `https://www.gotouniversity.com/#banner-ic-2`;
var resFinal=[];
var courseLengthTa=1;
var allCourses;
var disc=1;
var subDisc=1;
var discLength=100, subDiscLength=100;
let scrape = async ()=>{
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: false,
        args:[
            '--start-maximized', // you can also use '--start-fullscreen'
        ]
    });

    var counterCountry =0;
    const page = await browser.newPage();
    await page.goto(url,{waitUntil: 'networkidle2'});
    await page.waitForSelector('.banner-ic.ic-2');
    await page.click('.banner-ic.ic-2');
    await page.waitForSelector('.banner-ic.ic-16');
    await page.click('.banner-ic.ic-16');
    await page.waitForFunction(()=>document.querySelectorAll('#five-step-form .step-2.home-button-grp .row>div>.btn-blue')[70]!=null);

    countryName = await page.evaluate(async(counterCountry)=>{
        var btnBlue = document.querySelectorAll('#five-step-form .step-2.home-button-grp .row>div>.btn-blue')[counterCountry];
        let country = btnBlue.innerText.split('[');
        country= country[0].trim();
        return country;
    },counterCountry);
    
    await page.evaluate(async(counterCountry)=>{
        document.querySelectorAll('#five-step-form .step-2.home-button-grp .row>div>.btn-blue')[counterCountry].click();
    },counterCountry);

    await page.waitForSelector('#five-step-form .step-2.home-button-grp .row>div>.btn-blue');
    allCourses = await page.evaluate(async()=>{
        let allCourses = document.querySelectorAll('#five-step-form .step-2.home-button-grp .row>div>.btn-blue');
        let tempArr = [];
        for(let i=0; i<allCourses.length;i++){
            tempArr.push(allCourses[i].innerText.split('[')[0].trim());
        }
        return tempArr;
    });
    var cardsPage;
    for(disc=1; disc<discLength; disc++){
        try{
            for(subDisc=1; subDisc<subDiscLength; subDisc++){
                if((subDisc!=1)||(disc!=1)){
                    await cardsPage.close();
                    await page.waitForTimeout(666);                
                    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
                    await page.waitForSelector('.banner-ic.ic-2');
                    await page.click('.banner-ic.ic-2');
                    await page.waitForSelector('.banner-ic.ic-16');
                    await page.click('.banner-ic.ic-16');
                    await page.waitForFunction(()=>document.querySelectorAll('#five-step-form .step-2.home-button-grp .row>div>.btn-blue')[70]!=null);

                    await page.evaluate(async(counterCountry)=>{
                        document.querySelectorAll('#five-step-form .step-2.home-button-grp .row>div>.btn-blue')[counterCountry].click();
                    },counterCountry);
                }
                await page.waitForSelector('#five-step-form .step-2.home-button-grp .row>div>.btn-blue');
                //await for bachelorsonly.....
                await page.evaluate(async(courseLengthTa)=>{
                    document.querySelectorAll('#five-step-form .step-2.home-button-grp .row>div>.btn-blue')[courseLengthTa].click();
                },courseLengthTa);
                /********************************** */
                await page.waitForSelector('#five-step-form .step-2.home-button-grp .row>div>.btn-blue');
                if(subDisc==1){
                    discLength= await page.evaluate(async()=>{
                        return document.querySelectorAll('#five-step-form .step-2.home-button-grp .row>div>.btn-blue').length;
                    });
                }
                course_uni= await page.evaluate(async(disc)=>{
                    let btnBlue=  document.querySelectorAll('#five-step-form .step-2.home-button-grp .row>div>.btn-blue')[disc];
                    let tempVarReturn = btnBlue.innerText.split('[');
                    tempVarReturn= tempVarReturn[0].trim();
                    return tempVarReturn;
                },disc);
                await page.evaluate(async(disc)=>{
                    document.querySelectorAll('#five-step-form .step-2.home-button-grp .row>div>.btn-blue')[disc].click();
                },disc);
                await page.waitForSelector('#five-step-form .step-2.home-button-grp .row>div>.btn-blue');
                if(subDisc==1){
                    subDiscLength = await page.evaluate(async()=>{
                        return document.querySelectorAll('#five-step-form .step-2.home-button-grp .row>div>.btn-blue').length;
                    });
                }
                spec_uni= await page.evaluate(async(subDisc)=>{
                    let btnBlue= document.querySelectorAll('#five-step-form .step-2.home-button-grp .row>div>.btn-blue')[subDisc];
                    let tempVarReturn = btnBlue.innerText.split('[');
                    tempVarReturn= tempVarReturn[0].trim();
                    return tempVarReturn;
                },subDisc)
                await page.waitForSelector('#five-step-form .step-2.home-button-grp .row>div>.btn-blue');
                await page.waitForTimeout(666);
                let testingDo=false;
                do{
                    try{
                        const pageTarget = await page.target(); //save this to know that this was the opener
                        await page.waitForTimeout(999);
                        await page.evaluate(async(subDisc)=>{
                            document.querySelectorAll('#five-step-form .step-2.home-button-grp .row>div>.btn-blue')[subDisc].click();
                        },subDisc);
                        const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget); //check that you opened this page, rather than just checking the url
                        cardsPage = await newTarget.page(); //get the page object
                        testingDo=true;
                    }
                    catch(er){
                        console.log(er);
                        testingDo=false;
                        if(cardsPage) cardsPage.close();
                    }
                }while(testingDo==false)
                // await newPage.once("load",()=>{}); //this doesn't work; wait till page is loaded
                await cardsPage.waitForSelector(".panel"); //wait for page to be loaded
                let tempPageCount=0;
                do{  
                    //await cardsPage.waitForTimeout(666);
                    await cardsPage.waitForSelector('#pagin_count>li:last-child>a'); 
                    //
                    await cardsPage.waitForSelector(".panel"); //wait for page to be loaded
                    let cardLen = await cardsPage.evaluate(async()=>{
                        return document.querySelectorAll('.panel').length;
                    });
                    console.log(cardLen + '...cards');
                    
                    if(tempPageCount==0){
                        console.log('firstTime');
                        await cardsPage.waitForSelector('#pagin_count>li:last-child>a'); 
                        await cardsPage.click('#pagin_count>li:last-child>a'); 
                    }

                    for(let i=0; i<cardLen; i++){
                        var coursePage;
                        try{
                            await cardsPage.waitForTimeout(666);
                            let testingDoTwo=false;
                            do{
                                try{
                                    const pageTarget = await cardsPage.target(); //save this to know that this was the opener
                                    await cardsPage.waitForSelector(`#expand-${i}`, { visible: true });
                                    await cardsPage.waitForTimeout(999);
                                    await cardsPage.click(`#expand-${i}`);
                                    const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget); //check that you opened this page, rather than just checking the url
                                    coursePage = await newTarget.page(); //get the page object
                                    testingDoTwo=true;
                                }
                                catch(err){
                                    console.log(err);
                                    testingDoTwo=false;
                                    if(coursePage) coursePage.close();
                                }
                            }while(testingDoTwo==false)
                            // await newPage.once("load",()=>{}); //this doesn't work; wait till page is loaded
                            await coursePage.waitForSelector("body"); //wait for page to be loaded
                            let courseDetails = await coursePage.evaluate(async()=>{
                                var courseName = document.querySelector('.large-text.program-name')? document.querySelector('.large-text.program-name').innerText.trim() : '';
                                var univName = document.querySelector('.university-name')? document.querySelector('.university-name').innerText.trim(): '';
                                var locName = document.querySelector('.location-name')? document.querySelector('.location-name').innerText.trim(): '';
                                var duration = document.querySelector('.duration')? document.querySelector('.duration').innerText.trim(): '';
                                var Tfees = document.querySelector('.t-fees')? document.querySelector('.t-fees').innerText.trim(): '';
                                return [courseName, univName, locName, duration, Tfees];
                            });
                            let courseDetailsAll = await coursePage.evaluate(async()=>{
                                var  resArr=[];
                                var data = document.querySelectorAll('#collapse>div>div>div');
                                if(data.length==0){
                                    return resArr;
                                }
                                for(let j=0; j<5; j++){
                                let allItems= data[j].querySelectorAll('*:not(label)');
                                let tempTxt='';
                                allItems.forEach((el)=>{
                                    if(el.innerText.trim().length>0){
                                        tempTxt+=el.innerText.trim();
                                    }
                                });
                                resArr.push(tempTxt);
                                }
                                return resArr;
                            });
                            if(courseDetailsAll.length>3){
                                resFinal.push(countryName, allCourses[courseLengthTa], course_uni, spec_uni )
                                resFinal=resFinal.concat(courseDetails);
                                resFinal=resFinal.concat(courseDetailsAll);
                                resFinal.forEach((el)=>{
                                    writer.write(`'${el}'\t`)
                                });
                                writer.write('\n');
                            }
                        }
                        catch(er){
                            console.log('caught er in loop'+ er);
                            continue; 
                        }
                        finally{
                            await coursePage.close();
                        }
                        resFinal=[];
                    }           
                    await cardsPage.waitForSelector("#pagin_count>li"); //wait for page to be loaded
                    //for pagination ------w
                    let element = await cardsPage.$('#pagin_count>li:last-child>a');
                    if(element==null){
                        console.log('next found to be null reclicking... waiting for 3000ms');
                        await cardsPage.waitForTimeout(3000);
                    }
                    element = await cardsPage.$('#pagin_count>li:last-child>a');
                    let value = await cardsPage.evaluate(el => el.textContent, element);
                    //await cardsPage.waitForTimeout(666);
                    if(value.toUpperCase()=='NEXT'){
                        await cardsPage.click('#pagin_count>li:last-child>a');
                        console.log('NEXT clicked');
                        stop=false;
                    }
                    else{
                        stop=true;
                        console.log('stopped');
                    }
                    tempPageCount++;
                    console.log('@page ' + tempPageCount);      
                }while(stop==false);
            }
        }
        catch(err){
            console.log('caught err in discLoop' + err)
            subDisc--;
            continue;
        }
    }
browser.close();
    return;
}
scrape().then(()=>{
    console.log('finished')
});
