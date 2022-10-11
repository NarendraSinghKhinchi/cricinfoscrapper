const chalk = require('chalk');
const request = require("request");
const cheerio = require("cheerio") ;
const fs = require("fs");
const path = require("path");
const scorecard = require("./score");
const score = require('./score');
// console.log("hello");
const url = "https://www.espncricinfo.com/series/indian-premier-league-2022-1298423" ;

const iplPath = path.join(__dirname , "ipl");
dirCreater(iplPath);
request(url , cb);
function cb(error , response , body){
    if(error){
        console.log("error occured" , error);
    }else{
        // console.log(body);
        home_page(body);
    }
}
function home_page(html){
    // console.log("home") ;
    let $ = cheerio.load(html);

    let urlobject = $(".ds-block .ds-border-t.ds-border-line.ds-text-center.ds-py-2 .ds-inline-flex.ds-items-start.ds-leading-none");
    
    const allMatchUrl = ($(urlobject[0]).attr("href"));
    const fulllink = "https://www.espncricinfo.com"+ allMatchUrl ;
    // console.log(fulllink);
    allMatch_page(fulllink);
}

function allMatch_page(url){
    request(url, function(error , response , html){
        if(error){
            console.log("error occured");
        }else{
            allMatch_page_handler(html);
        }     
    });
    function allMatch_page_handler(html){
        
        const $ = cheerio.load(html);
        let Matchobject = $(".ds-p-0>div>div>div>a");
        
        for(let i = 0 ; i < Matchobject.length ; i++){
            const matchlink = ($(Matchobject[i]).attr("href"));
            const fulllink = "https://www.espncricinfo.com"+ matchlink ;
            console.log(fulllink);
            scorecard.scorecard_writer(fulllink);
        }
    }
}

function dirCreater(filePath){
    if(!fs.existsSync(filePath)){
        fs.mkdirSync(filePath);
    }
}

