import * as deviceInterface from "../Interfaces/rprtDeviceInterface";

// Import xml2js library
const xml2js = require("xml2js");
const parser = new xml2js.Parser(); // Initialize xml2js parser
/**
 * parser for parsing RMF monitor I CPU report XML data to JSON
 * @param {string} xml - Workload XML data from RMF Monitor I
 */
export default async function parseDEVICE(xml) {
    try {
        const result = await parser.parseStringPromise(xml);
        const finalJSON = {}; // Collection for storing JSON of Parsed XML
        const postprocessors = result.ddsml.postprocessor;
        for (const a in postprocessors) {
          // Loop through postprocessor sections
          let singleReport: Partial<deviceInterface.Device> = {};//segment number (b) as key and detals as value
          const segments = postprocessors[a].segment;
          for (const b in segments) {
            var segmentName = segments[b].name[0];
            const parts = segments[b].part;
            if (segmentName.trim() == "Direct Access Device Activity") {
                //let sg: Partial<deviceInterface.SG> = {};
                //const mappingCollection: Record<string, Partial<deviceInterface.SG>> = {};
                for(const c in parts){
                    if(Object.keys(parts[c]).length > 1 ) { // The part has no childnodes
                        switch (`${c}`) {
                            case "0" : {
                                const varlist = parts[c]["var-list"];
                                for (var vr in varlist[0]["var"]) {
                                    switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                        case "Total Samples": {
                                            singleReport.totalSamples= parseInt(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "IODF Name Suffix": {
                                            singleReport.iodfNameSuffix = varlist[0]["var"][vr].value[0].trim();
                                            break;
                                        }
                                        case "IODF Creation Date": {
                                            singleReport.iodfCreationDate = varlist[0]["var"][vr].value[0].trim();
                                            break;
                                        }
                                        case "IODF Creation Time": {
                                            singleReport.iodfCreationTime =  varlist[0]["var"][vr].value[0].trim();
                                            break;
                                        }
                                        case "Configuration State": {
                                            singleReport.configurationState = varlist[0]["var"][vr].value[0].trim();
                                            break;
                                        }
                                    } 
                                }
                                break;
                            } case "1" : {
                                const { table } = parts[c];
                                const tableBody = table[0].row;
                                const mappingCollection: Record<string, Partial<deviceInterface.SG>> = {};
                                
                                for (var tb in tableBody) {
                                const sg: Partial<deviceInterface.SG> = {};
                                    sg.storageGroup = tableBody[tb].col[0].trim();
                                    sg.deviceNumber = parseInt(tableBody[tb].col[1].trim());
                                    sg.deviceType = tableBody[tb].col[2].trim();
                                    sg.numberOfCylinders = parseInt(tableBody[tb].col[3]);
                                    sg.volumeserialNumber = parseFloat(tableBody[tb].col[4].trim());
                                    sg.availablePAvDevices = parseFloat(tableBody[tb].col[5].trim());
                                    sg.hyperPAV = parseFloat(tableBody[tb].col[6].trim());
                                    sg.lcuNumber = parseFloat(tableBody[tb].col[7].trim());
                                    sg.deviceActivityRate = parseFloat(tableBody[tb].col[8].trim());
                                    sg.responseTime = parseFloat(tableBody[tb].col[9].trim());
                                    sg.iosQueueTime = parseFloat(tableBody[tb].col[10].trim());
                                    sg.cmrDelay = parseFloat(tableBody[tb].col[11].trim());
                                    sg.deviceBusyDelay = parseFloat(tableBody[tb].col[12].trim());
                                    sg.interruptDelayTime = parseFloat(tableBody[tb].col[13].trim());
                                    sg.devicePendingTime = parseFloat(tableBody[tb].col[14].trim());
                                    sg.deviceDisconnectTime = parseFloat(tableBody[tb].col[15].trim());
                                    sg.deviceConnectTimeAVG = parseFloat(tableBody[tb].col[16].trim());
                                    sg.deviceConnectTimePercent = parseFloat(tableBody[tb].col[17].trim());
                                    sg.deviceUtilized = parseFloat(tableBody[tb].col[18].trim());
                                    sg.devicedReserved = parseFloat(tableBody[tb].col[19].trim());
                                    sg.numberAllocated = parseFloat(tableBody[tb].col[20].trim());
                                    sg.deviceAllocatedPercentage = parseFloat(tableBody[tb].col[21].trim());
                                    sg.message = tableBody[tb].col[22].trim();
                                    mappingCollection[tb] = sg;
                                }
                                singleReport.storageGroup = mappingCollection
                                break;
                            }
                        }
                    }
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