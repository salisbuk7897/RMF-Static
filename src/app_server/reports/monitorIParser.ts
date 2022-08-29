// Import xml2js library
const xml2js = require("xml2js");
const parser = new xml2js.Parser(); // Initialize xml2js parser
/**
 * parser for parsing RMF monitor I CPU report XML data to JSON
 * @param {string} xml - Workload XML data from RMF Monitor I
 */
export default async function parseRMFI(xml) {
    try {
        const result = await parser.parseStringPromise(xml);
        var finalJSON = {}; // Collection for storing JSON of Parsed XML
        var postprocessors = result['ddsml']['postprocessor'];
        for (var a in postprocessors) { // Loop through postprocessor sections
            var singleReport = {};
            var segments = postprocessors[a]['segment'];
            var resourceName = postprocessors[a]['resource'][0]['resname'][0];
            var reportId = postprocessors[a]['metric'][0]['$']['id'];
            var allSegmentCollection = {};
            for (var b in segments) { // Loop through segment sections
                var parts = segments[b]['part'];
                var segmentName = segments[b]['name'][0];
                var message = segments[b]['message']; // represent segment message value in the XML
                var partCollection = {};
                for (var c in parts) { // Loop through part sections
                    var partName = parts[c]['name'];
                    var varlist = parts[c]['var-list'];
                    var table = parts[c]['table'];
                    var fieldCollection = {};

                    if (varlist) { // If part contains a list of variables
                        var variables = varlist[0]['var'];
                        for (var d in variables) {
                            fieldCollection[variables[d]['name'][0].trim()] = isNaN(Number(variables[d]['value'][0].trim()))? variables[d]['value'][0].trim() : parseFloat(variables[d]['value'][0].trim());//variables[d]['value'][0];
                        }
                    }

                    if (table) { // If part contains a table
                        var tableColumnHeader = table[0]['column-headers'][0]['col'];
                        var tableBody = table[0]['row'];
                        var columnheadCollection = [];
                        var finalTableReport = [];
                        for (var i in tableColumnHeader) {
                            columnheadCollection[i] = tableColumnHeader[i]['_'].trim() ? tableColumnHeader[i]['_'].trim() : "Name";
                        }

                        if (tableBody !== undefined) { // If table is not empty
                            for (var i in tableBody) {
                                var partTable = {}
                                for (var j in columnheadCollection) {
                                    partTable[columnheadCollection[j].trim()] = isNaN(Number(tableBody[i]['col'][j].trim()))? tableBody[i]['col'][j].trim() : parseFloat(tableBody[i]['col'][j].trim());//tableBody[i]['col'][j];
                                }
                                finalTableReport.push(partTable);
                            }
                        }

                        if (!varlist) { // If part contains only table and no var list
                            fieldCollection = finalTableReport;
                        } else {   
                            fieldCollection["Table"] = finalTableReport;
                        }
                    }

                    if (partName && Array.isArray(partName)) { // Makes sure that partName is not an array (special case)
                        partName = partName[0].trim();
                    }
                    if (partName && partName !== "") { // If part already has a name 
                        partCollection[partName] = fieldCollection;
                    } else {
                        partCollection['Info'] = fieldCollection;
                    }

                    // Removes unnecessary INFO tag if it is only part of segment
                    if (Object.keys(partCollection).length === 1 && Object.keys(partCollection)[0] === "Info") {
                        partCollection = { ...partCollection['Info'] };
                    }

                    if (message) {  // if segment contains mesaage atrributes in the XML
                        var messageDescription = message[0]['description'][0].trim(); // represent message description
                        var messageSeverity = message[0]['severity'][0].trim(); // represent message severity
                        var messageCollection = {} // A JSON for message Collection
                        messageCollection['Description'] = messageDescription; // message Description key value pairs in messageCollection
                        messageCollection['Severity'] = messageSeverity; // message severity key value pairs in messageCollection
                        partCollection = { "Message": messageCollection, ...partCollection };
                    }

                    // Set collection of data
                    allSegmentCollection[segmentName] = partCollection;

                }
            }
            singleReport['Report'] = postprocessors[a]['metric'][0]["description"][0].trim();
            singleReport["System"] = resourceName.trim();
            singleReport['Timestamp'] = postprocessors[a]['time-data'][0]['display-start'][0]['_'].trim();
            if (reportId === "WLMGL") { // SPECIAL CASE MAPPING
                let segKeys = Object.keys(allSegmentCollection);
                singleReport = {
                    ...singleReport,
                    "Classes": segKeys.map( (key) => {
                        return {
                            Name: key.trim(),
                            ...allSegmentCollection[key]
                        }
                    })
                };
            } else {
                singleReport = {
                    ...singleReport,
                    ...allSegmentCollection
                };
            }

            if (finalJSON[reportId]) {  // If report ID is already been used, push to array
                finalJSON[reportId].push(singleReport);
            } else {  // If not, create array with initial value
                finalJSON[reportId] = [ singleReport ];
            }
        }
        // If only one report ID, report IDs are unnecessary so extract data into root object
        var finalKeys = Object.keys(finalJSON);
        if (finalKeys.length === 1) {
            finalJSON = { ...finalJSON[finalKeys[0]] }
        }
        return finalJSON;
    }catch(e){
        console.log(e);
        return e;
    }
}