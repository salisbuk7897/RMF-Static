// Import xml2js library
const xml2js = require("xml2js");
const parser = new xml2js.Parser(); // Initialize xml2js parser
/**
 * parser for parsing RMF monitor I CPU report XML data to JSON
 * @param {string} xml - Workload XML data from RMF Monitor I
 */
export default async function parseRMFIII(xml, name: string) {
    try {
        const result = await parser.parseStringPromise(xml);
        //Variables initialization from XML attributes
        var timestart = result['ddsml']['report'][0]['time-data'][0]['display-start'][0]['_']; //Initialize timestart variable
        var timeend = result['ddsml']['report'][0]['time-data'][0]['display-end'][0]['_']; //Initialize timeend variable
        var desc = result['ddsml']['report'][0]['metric'][0]['description'][0]; //initialize desc variable
        var columnheader = result['ddsml']['report'][0]['column-headers'][0]['col']; //initialize columnhead variable
        try { //not all reports have the caption XML attribute and this leads to error if the attribute is missing
            var tablebody = result['ddsml']['report'][0]['row']; //initialize tablebody variable
            var caption = result['ddsml']['report'][0]['caption'][0]['var']; //initialize caption variable
        }
        catch (err) {
        }
        //Collections 
        var table = [];
        var captions = {}; //collection for caption name and value pairs from XML
         
        var parsedJSON = {}; //Collection for JSON from parsed monitor III XML
        var columnhead = []; //Collection for column header name and value pairs from XML

        parsedJSON["title"] = desc; // parsed JSON title key value pair
        parsedJSON["timestart"] = timestart; // parsed JSON timestart key value pair
        parsedJSON["timeend"] = timeend;
        if (caption != undefined) {
            for (i in caption) { //loop through cation XML Attributes
                try{
                    captions[caption[i].name[0].trim()] =  isNaN(Number(caption[i].value[0].trim()))? caption[i].value[0].trim() : parseFloat(caption[i].value[0].trim());
                }catch(e){
                    captions[caption[i].name[0].trim()] = caption[i].value[0].trim();
                }
            };
            parsedJSON["caption"] = captions
        }
            
        //Loop for Column Header XML Atribute
        for (var i in columnheader) {
            columnhead[i] = columnheader[i]['_'].trim(); //populate the colunmhead collection
        };

        //Loop for Rows XML Attributes
        if (tablebody != undefined) {  //check if XML contains table body
            for (var k in tablebody) { // Loop through table body
                var tbody= {};
                for (var i in columnhead) { //
                    try{
                        tbody[columnhead[i].trim()] = isNaN(Number(tablebody[k]['col'][i].trim()))? tablebody[k]['col'][i].trim() : parseFloat(tablebody[k]['col'][i].trim());
                    }catch(e){
                        tbody[columnhead[i].trim()] = tablebody[k]['col'][i].trim();
                    }
                }
                table.push(tbody);  //Push rows to tbody collection
            }
        }
        
        parsedJSON[name.toLowerCase()] = table
        return parsedJSON;
    }catch(e){
        console.log(e);
        return e;
    }
}