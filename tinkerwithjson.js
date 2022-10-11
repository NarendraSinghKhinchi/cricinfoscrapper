const fs = require("fs") ;
const xlsx = require("xlsx");

let buffer = fs.readFileSync("./ex.json");
console.log(buffer);
console.log("==========================================================");
let data = JSON.parse(buffer);
// console.log(data);
// data.push({
//     "name": 'thor',
//     "lastName": 'odinson',
//     "isAvenger": true,
//     "friends": [ 'bruce', 'Natasha', 'thor', 'ironman' ],
//     "age": 45,
//     "address": { city: 'NewYork', state: 'manhatten' }
//   });
//   let string = JSON.stringify(data);
//   fs.writeFileSync("ex.json" , string);

// new worksheet
// let newWb = xlsx.utils.book_new();
// json data -> excel format convert
// let newWs = xlsx.utils.json_to_sheet(data);
// -> newWb , ws , sheetname
// xlsx.utils.book_append_sheet(newWb , newWs , "sheet-1");
// filePath
// xlsx.writeFile(newWb , "abc.xlsx"); 

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
    let excelData = wb.Sheets(sheetName);
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ;
}