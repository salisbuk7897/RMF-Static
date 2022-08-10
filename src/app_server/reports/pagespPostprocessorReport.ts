import * as pagespInterface from "../Interfaces/pagespInterface";

// Import xml2js library
const xml2js = require("xml2js");
const parser = new xml2js.Parser(); // Initialize xml2js parser
/**
 * parser for parsing RMF monitor I CPU report XML data to JSON
 * @param {string} xml - Workload XML data from RMF Monitor I
 */
export default async function parsePAGESP(xml) {
    try {
        const result = await parser.parseStringPromise(xml);
        const finalJSON = {}; // Collection for storing JSON of Parsed XML
        const postprocessors = result.ddsml.postprocessor;
        for (const a in postprocessors) {
          // Loop through postprocessor sections
          let singleReport: Partial<pagespInterface.Pagesp> = {};
          const segments = postprocessors[a].segment;
          
          for (const b in segments) {
            var segmentName = segments[b].name[0];
            const parts = segments[b].part;
            if (segmentName.trim() == "Page Data Set and SCM Usage") {
                let dsList = [];
                const info: Partial<pagespInterface.Info> = {}
                
              
              for (const c in parts) {
                if(Object.keys(parts[c]).length > 1 ) { // The part has no childnodes
                    
                    switch (`${c}`) {
                        case "0":{
                            const varlist = parts[c]["var-list"];
                
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                    case "Samples": {
                                        info.totalSamples = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                } 
                            }

                            const { table } = parts[c];
                            const tableBody = table[0].row;
                            for (var tb in tableBody) {
            
                                const dataset: Partial<pagespInterface.Dataset> = {}
                                const slot: Partial<pagespInterface.Slots> = {}
                                dataset.spaceType = tableBody[tb].col[0].trim();
                                dataset.volumeSerial = tableBody[tb].col[1].trim();
                                dataset.deviceNumber = tableBody[tb].col[2].trim();
                                dataset.deviceType = parseFloat(tableBody[tb].col[3].trim());
                                slot.allocated = parseFloat(tableBody[tb].col[4].trim());
                                slot.usedMin = parseFloat(tableBody[tb].col[5].trim());
                                slot.usedMax = parseFloat(tableBody[tb].col[6].trim());
                                slot.useAvg = parseFloat(tableBody[tb].col[7].trim());
                                slot.badSlots = parseFloat(tableBody[tb].col[8].trim());
                                dataset.inUse = parseFloat(tableBody[tb].col[9].trim());
                                dataset.transferTime = parseFloat(tableBody[tb].col[10].trim());
                                dataset.ioRequest = parseFloat(tableBody[tb].col[11].trim());
                                dataset.pagesTransferred = parseFloat(tableBody[tb].col[12].trim());
                                dataset.vio = parseFloat(tableBody[tb].col[13].trim());
                                dataset.datasetName = tableBody[tb].col[14].trim();
                                dataset.message = tableBody[tb].col[15].trim();
                                
                                dataset.slots = slot
                                dsList.push(dataset);
                            
                            }

                            break;
                        }

                    } 
                }
                
              }
              
              singleReport.info = info
              singleReport.dataset = dsList

            }
          }
          finalJSON[a] = singleReport;
        }
        //console.log(finalJSON);
        return finalJSON;
    }catch(e){
        console.log(e);
        return e;
    }
}