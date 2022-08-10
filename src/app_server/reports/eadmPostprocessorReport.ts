import * as eadmInterface from "../Interfaces/eadmInterface";

// Import xml2js library
const xml2js = require("xml2js");
const parser = new xml2js.Parser(); // Initialize xml2js parser
/**
 * parser for parsing RMF monitor I CPU report XML data to JSON
 * @param {string} xml - Workload XML data from RMF Monitor I
 */
export default async function parseEADM(xml) {
    try {
        const result = await parser.parseStringPromise(xml);
        const finalJSON = {}; // Collection for storing JSON of Parsed XML
        const postprocessors = result.ddsml.postprocessor;
        for (const a in postprocessors) {
          
          // Loop through postprocessor sections
          let singleReport: Partial<eadmInterface.eadm> = {};//segment number (b) as key and detals as value
          const segments = postprocessors[a].segment;
          
          for (const b in segments) {
            var segmentName = segments[b].name[0];
            const parts = segments[b].part;
            if (segmentName == "Device/Subchannel Summary") {
              const device: Partial<eadmInterface.device> = {};
              for (const c in parts) {
                const varlist = parts[c]["var-list"];
                
                for (var vr in varlist[0]["var"]) {
                  switch (`${varlist[0]["var"][vr].name[0]}`) {
                    case "Total Number of SSCH": {
                        device.totalSSCH = parseFloat(varlist[0]["var"][vr].value[0]);
                        break;
                    }
                    case "SSCH Rate": {
                        device.sschRate = parseFloat(varlist[0]["var"][vr].value[0]);
                        break;
                    }
                    case "Avg Function Pending Time": {
                        device.pendingTime = parseFloat(varlist[0]["var"][vr].value[0]);
                        break;
                    }
                    case "Avg IOP Queue Time": {
                      device.queueTime = parseFloat(varlist[0]["var"][vr].value[0]);
                      break;
                    }
                    case "Avg Initial Cmd Response Time": {
                        device.responseTime = parseFloat(varlist[0]["var"][vr].value[0]);
                        break;
                    }
                  } 
                }
              }
              singleReport.device = device
            }else if(segmentName == "Compression Activity"){
                const compression: Partial<eadmInterface.compression> = {};
              for (const c in parts) {
                const varlist = parts[c]["var-list"];
                
                for (var vr in varlist[0]["var"]) {
                  switch (`${varlist[0]["var"][vr].name[0]}`) {
                    case "Compression Request Rate": {
                        compression.compressionRR = parseFloat(varlist[0]["var"][vr].value[0]);
                        break;
                    }
                    case "Compression Throughput": {
                        compression.compressionThroughput = parseFloat(varlist[0]["var"][vr].value[0]);
                        break;
                    }
                    case "Compression Ratio": {
                        compression.compressionRatio = parseFloat(varlist[0]["var"][vr].value[0]);
                        break;
                    }
                    case "Decompression Request Rate": {
                      compression.decompressionRR = parseFloat(varlist[0]["var"][vr].value[0]);
                      break;
                    }
                    case "Decompression Throughput": {
                        compression.decompressionThroughput = parseFloat(varlist[0]["var"][vr].value[0]);
                        break;
                    }
                    case "Decompression Ratio": {
                        compression.decompressionRatio = parseFloat(varlist[0]["var"][vr].value[0]);
                        break;
                    }
                  } 
                }
              }
              singleReport.compression = compression

            }else if(segmentName == "Storage Class Memory Activity"){
              for(const c in parts){
                const { table } = parts[c];
                const tableBody = table[0].row;
                const storage: Partial<eadmInterface.storage> = {};
                
                for (var tb in tableBody) {
                  storage.id = tableBody[tb].col[0];
                  storage.lparUtil = parseFloat(tableBody[tb].col[1]);
                  storage.totalUtil = parseFloat(tableBody[tb].col[2]);
                  storage.lparRead = parseFloat(tableBody[tb].col[3]);
                  storage.totalRead = parseFloat(tableBody[tb].col[4]);
                  storage.lparWrite = parseFloat(tableBody[tb].col[5]);
                  storage.totalWrite = parseFloat(tableBody[tb].col[6]);
                  storage.lparRR = parseFloat(tableBody[tb].col[7]);
                  storage.totalRR = parseFloat(tableBody[tb].col[8]);
                  storage.lparResponse = parseFloat(tableBody[tb].col[9]);
                  storage.totalResponse= parseFloat(tableBody[tb].col[10]);
                  storage.totalQueue = parseFloat(tableBody[tb].col[11]);
                  storage.lparRequests = parseFloat(tableBody[tb].col[12]);
                  storage.totalRequests = parseFloat(tableBody[tb].col[13]);
                }
                singleReport.storage = storage
              }
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