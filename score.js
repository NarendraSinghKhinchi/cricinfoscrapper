const chalk = require('chalk');
const request = require("request");
const cheerio = require("cheerio") ;
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

function scorecard_writer(url){
    request(url , cb);
}


function cb(error , response , body){
    if(error){
        console.log("error occured");
    }else{
        // console.log(body);
        specificMath_details_writer(body);
    }
}
function specificMath_details_writer(html){
    // venue date and result are same for both the teams so lets find out them first

    const $ = cheerio.load(html);

    const resultobj = $(".ds-flex>div>div>div>p>span");
    const resultString = $(resultobj[0]).text() ;
    const result = resultString.split("won")[0].trim();
    
    const venueobj = $(".ds-grow>div.ds-text-tight-m.ds-font-regular.ds-text-ui-typo-mid");
    const venueString = $(venueobj[0]).text();
    const venuearr = venueString.split(",");
    const venue = (venuearr[1]).trim();
    const date = (venuearr[2] + venuearr[3]).trim();
    const tableobj = $(".ds-rounded-lg.ds-mt-2");

    for(let i = 0 ; i < tableobj.length ; i++){
        const teamName = $(tableobj[i]).find(".ds-text-title-xs.ds-font-bold.ds-capitalize").text() ;
        // console.log(teamName);
        const opponentidx = i==0?1:0 ;
        const opponentName = $(tableobj[opponentidx]).find(".ds-text-title-xs.ds-font-bold.ds-capitalize").text() ;
        // console.log(opponentName);
        console.log(teamName + " Vs " + opponentName + " " + venue + " " + date );
        const teamstatstable = $(tableobj[i]).find(".ds-p-0>table");
        const allrows = $(teamstatstable[0]).find("tr");
        for(let i = 1 ; i < allrows.length - 4 ; i++ ){
            if($(allrows[i]).hasClass("ds-hidden")){
                continue ;
            }else{
                const allcols = $(allrows[i]).find("td");
                const playerName = $(allcols[0]).text().trim() ;
                const runs = $(allcols[2]).text().trim() ;
                const balls = $(allcols[3]).text().trim() ;
                const fours = $(allcols[5]).text().trim() ;
                const sixes = $(allcols[6]).text().trim() ;
                const sr = $(allcols[7]).text().trim() ;
                console.log(playerName + " " + runs + " " + balls + " " + fours + " " + sixes);
                processPlayer(teamName , playerName , runs , balls , fours , sixes , sr , opponentName ,venue , date);
            }
        }
    }
     
}
function processPlayer(teamName , playerName , runs , balls , fours , sixes , sr , opponentName ,venue , date){
    const teamPath = path.join(__dirname , "ipl" , teamName);
    dirCreater(teamPath);
    let filePath = path.join(teamPath, playerName + ".xlsx");
    let content = excelReader(filePath , playerName);
    let playerObj = {
        teamName,
        playerName,
        runs , balls, fours ,
        sixes , 
        sr ,
        opponentName,
        venue,
        date
    }
    content.push(playerObj);
    excelWriter(filePath , content , playerName);
}
function dirCreater(filePath){
    if(!fs.existsSync(filePath)){
        fs.mkdirSync(filePath);
    }
}
function excelWriter(filePath , json , sheetName){
    const newWb = xlsx.utils.book_new();
    const newWs = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWb ,newWs , sheetName);
    xlsx.writeFile(newWb , filePath);
}
function excelReader(filePath , sheetName){
    if(!fs.existsSync(filePath)){
        return [] ;
    }
    const wb = xlsx.readFile(filePath);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans ;
}
module.exports = {
    scorecard_writer : scorecard_writer 
}