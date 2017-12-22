var request = require('request');
const fs = require('fs');
const path = require('path');
const csv=require('csvtojson');

/**
 * function convert CSV 2 JSON using csvtojson library
 * @param {*} foldername 
 * @param {*} filename 
 */
module.exports = function convertCSV2JSON(foldernameCSV, filenameCSV, foldernameJSON, filenameJSON, maxJsonLines)
{
    console.log('convert CSV to JSON...');

    const csvoption = {
        noheader: false,
        toArrayString: true}

    //convert file from csv to json
    var jsonBuff = "[\n";    

    const conv=csv(csvoption)
    .fromFile(foldernameCSV+'/'+filenameCSV)
    .on('json',(json, rowIndex)=>{

        if (rowIndex >= maxJsonLines) {
            //Lab Requirement: The JSON file must have an array with 1000 items.   
            //original CSV file is 1000 records... so we don't really need the logic... 
            //but I played with this in scenario when we have CSV with more than 1000 records but need convert only top 1000
            
            //there's header - so rowIndex - 1
            console.log('reach 1000 lines - unsubscribe json event');
            conv.removeAllListeners('json');// unsubscribe "json" event when we reached 1000 csv record
        }
        else
        {
          if (rowIndex != 0)
          {
            jsonBuff += ",\n";
          }
            
          // stringify with tabs inserted at each level
          jsonBuff += JSON.stringify(json, null, "\t");          
        }
    })        
    .on('end',()=>{
        console.log('done');    
        jsonBuff += "\n]";
        
        saveJSON(jsonBuff, foldernameJSON, filenameJSON);
    });            
}

/**
 * function saves JSON to file
 * @param {*} json 
 * @param {*} foldername 
 * @param {*} filename 
 */
function saveJSON(json, foldername, filename)
{
    console.log('save JSON file...');    
    //just in case check/create output folder
    //by default that folder is the same as csv folder but in case if we change this in future
    if (!fs.existsSync(foldername)){
        fs.mkdirSync(foldername);
    }
  
    //if JSON file exists - remove it
    if (fs.existsSync(foldername+'/'+filename)){
        console.log('file exists in folder: we need remove it');
        fs.unlinkSync(foldername+'/'+filename);        
    }
    
    fs.writeFileSync(path.join(__dirname, foldername, filename), json);    
    console.log('done');    
}
