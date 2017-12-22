const request = require('request');
const fs = require('fs');
const path = require('path');

const csv2jsonconverter = require('./csv2jsonconverter');

const url = 'http://prod-edxapp.edx-cdn.org/assets/courseware/v1/07d100219da1a726dad5eddb090fa215/asset-v1:Microsoft+DEV283x+2T2017+type@asset+block/customer-data.csv';
const folderNameCSV = './data';
const folderNameJSON = './data'; //same as CSV... but just in case create 2 variables
const fileNameCSV = 'customer-data.csv';
const fileNameJSON = 'customer-data.json';
const maxJsonLines = 1000; //The JSON file must have an array with 1000 items. just play with scenario when CSV file has more thant 1K records

//dowload file from web
console.log('downloading ', url);

//download csv file only once. if the file exists - convert 2JSON only
if (fs.existsSync(folderNameCSV + '/' + fileNameCSV)) {
    console.log('was already exists in folder: ', folderNameCSV, ' skip download');

    csv2jsonconverter(folderNameCSV, fileNameCSV, folderNameJSON, fileNameJSON, maxJsonLines);
}
//file not exists - download it. when download is compelted - convert it
else {
    //create folder if it's necessary
    if (!fs.existsSync(folderNameCSV)) {
        fs.mkdirSync(folderName);
    }

    //download file via node library request
    //https://github.com/request/request
    request.get(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = body;
            console.log('downloading...');
            fs.writeFileSync(path.join(__dirname, folderNameCSV, fileNameCSV), data);
            console.log('download - completed to folder', folderNameCSV);

            //download - completed. do convert
            csv2jsonconverter(folderNameCSV, fileNameCSV, folderNameJSON, fileNameJSON, maxJsonLines);
        }
    });
}
